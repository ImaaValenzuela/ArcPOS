# Ciclo de vida del pago

```text
created -> pending -> confirmed -> settled
                    |             |
                    v             v
                 failed        refunded
```

Un webhook repetido no puede crear un segundo movimiento. La implementación del ledger deberá imponer una referencia externa única y una clave de idempotencia por operación.
