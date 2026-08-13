# Pagos QR e infraestructura argentina

- **ID:** `market-001`
- **Estado:** `validated`
- **Fecha:** `2026-08-13`
- **Área:** mercado y regulación

## Pregunta

¿Podemos crear un QR universal propio y cuál es el rol correcto de ArcPOS en el sistema argentino?

## Alcance

QR interoperable, pagos con transferencia, participantes regulatorios y competencia de aceptación. No cubre todavía contratos legales ni una opinión jurídica.

## Hechos

El BCRA describe Transferencias 3.0 como un ecosistema de transferencias inmediatas que incluye pagos con transferencia mediante QR. Indica que:

- Cualquier billetera puede leer un QR interoperable.
- El pagador puede usar una cuenta CBU o CVU.
- La acreditación es inmediata y está disponible 24/7.
- Los pagos son irrevocables.
- El aceptador ofrece al comercio las herramientas de cobro.
- Los pagos con transferencia tienen reglas comerciales distintas de una transferencia común.

El registro del BCRA distingue, entre otros, estos participantes:

- Aceptador.
- Adquirente.
- Agregador.
- Administrador QR.
- Proveedor de cuenta de pago.

Mercado Pago comunica que ofrece QR, pagos desde otras billeteras o bancos, cobro desde el celular, Point Tap, tarjetas y liquidación inmediata en determinadas modalidades.

## Conclusiones

1. ArcPOS no debe inventar un protocolo QR argentino propio.
2. Para pagos ARS productivos necesitamos integrarnos con un PSP, adquirente, agregador o participante habilitado.
3. ArcPOS puede comenzar como software de experiencia, orquestación y conciliación, dejando el rol regulado al partner.
4. El QR interoperable por sí solo no es una ventaja suficiente frente a Mercado Pago.
5. La diferenciación debe estar en la combinación de rieles y liquidación, no en el formato visual del QR.

## Impacto en el scope

```text
ArcPOS UI/API
    -> adaptador PSP argentino
    -> QR interoperable y liquidación ARS
```

El sandbox debe representar este límite mediante `SandboxQrProvider`, sin simular que ArcPOS es un adquirente real.

## Preguntas abiertas

- ¿Qué PSP ofrece white-label para comercios pequeños?
- ¿Qué participante puede entregar QR dinámico y webhooks?
- ¿Quién asume fraude, reembolsos y disputas?
- ¿Qué condiciones aplican para liquidación a CBU/CVU?
- ¿Podemos combinar el cobro ARS con liquidación posterior en USDC?

## Fuentes

- [BCRA - Transferencias 3.0](https://www.bcra.gob.ar/medios-de-pago/transferencias-3-0/) - fecha de consulta: `2026-08-13`.
- [BCRA - Registro de proveedores de servicios de pago](https://www.bcra.gob.ar/registro-de-proveedores-de-servicios-de-pago/) - fecha de consulta: `2026-08-13`.
- [Mercado Pago - Cobrar con QR](https://www.mercadopago.com.ar/qr) - fecha de consulta: `2026-08-13`.
