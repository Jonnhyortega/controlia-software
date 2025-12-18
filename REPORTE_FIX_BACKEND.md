# Reporte Técnico: Fallo en Registro de Pagos Parciales

## 1. Descripción del Incidente
Se ha detectado que el sistema backend no está procesando correctamente las ventas con **pagos parciales** (e.g., abono de $50.000 sobre una venta de $360.000). 
Actualmente, el backend ignora el monto abonado enviado por el frontend y registra la venta como "Pagada Totalmente", lo que genera dos problemas críticos:
1.  **Caja Descuadrada:** Se suma al `DailyCash` dinero que no ingresó físicamente (se suma el total en lugar del abono).
2.  **Deuda Inexistente:** No se genera la deuda en la cuenta corriente del cliente.

## 2. Diagnóstico (Evidencia de Logs)
Se realizaron pruebas de depuración confirmando que el **Frontend funciona correctamente**.
*   **Envío del Client (Payload):**
    ```json
    {
      "total": 13999,
      "amountPaid": 3999,  <-- DATO CORRECTO ENVIADO
      "clientId": "693df0cc..."
    }
    ```
*   **Respuesta del Servidor:**
    ```json
    {
      "sale": {
        "total": 13999,
        "amountPaid": 13999, <-- ERROR: El backend lo sobrescribió con el total
        "amountDebt": 0
      }
    }
    ```

**Conclusión:** El controlador `createSale` en el backend no está implementando (o no está ejecutando) la lógica para diferenciar el `total` del `amountPaid`.

---

## 3. Requerimientos de Corrección (Backend)

Para solucionar esto, el desarrollador Backend debe aplicar los siguientes cambios en `saleController.js` y `Sale.js`.

### A. Modelo (`Sale.js`)
Asegurar que el esquema de Mongoose tenga los campos:
```javascript
amountPaid: { type: Number, default: 0 },
amountDebt: { type: Number, default: 0 },
client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" }
```

### B. Controlador (`saleController.js`) -> Función `createSale`

**Lógica actual (presunta):**
Probablemente está haciendo esto:
```javascript
// ERROR: Asume que paga todo
const amountPaid = total; 
```

**Lógica Requerida:**
Debe implementar esto:

```javascript
// 1. Obtener datos del body
const { amountPaid, total, clientId } = req.body;

// 2. Determinar lo que realmente pagó
let finalAmountPaid = total; // Default: Paga todo
if (amountPaid !== undefined && amountPaid !== null) {
    finalAmountPaid = Number(amountPaid);
}

// 3. Calcular Deuda
const finalAmountDebt = total - finalAmountPaid;

// 4. Si hay deuda, actualizar saldo del Cliente
if (finalAmountDebt > 0 && clientId) {
    await Client.findByIdAndUpdate(clientId, { $inc: { balance: finalAmountDebt } });
}

// 5. Crear Venta
const newSale = await Sale.create({
    // ... resto de campos
    total: total,
    amountPaid: finalAmountPaid, // <--- Guardar lo real
    amountDebt: finalAmountDebt  // <--- Guardar la deuda
});

// 6. Actualizar CAJA (CRÍTICO)
// Solo sumar lo que realmente entró (finalAmountPaid), NO el total.
await DailyCash.findOneAndUpdate(..., {
    $inc: { 
        totalSalesAmount: finalAmountPaid, // <--- CORRECTO
        totalOperations: 1 
    }
});
```

## 4. Acción Inmediata
Es altamente probable que el código ya haya sido editado pero **el servidor no se haya reiniciado**. 
Se recomienda:
1.  Detener el proceso del backend.
2.  Iniciar nuevamente el servidor.
3.  Verificar que la lógica anterior esté presente en `createSale`.
