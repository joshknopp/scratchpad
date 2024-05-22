# How to Apostille a New York City Birth Certificate

## Relevant Links
- [Process overview](https://portal.311.nyc.gov/article/?kanumber=KA-01012)
- [VitalChek request form](https://www.vitalchek.com/birth-certificates/new-york/new-york-city-dept-of-health-and-mental-hygiene)
- [County clerk verification info](https://portal.311.nyc.gov/article/?kanumber=KA-01029)
- [NY Dept of State Apostille info](https://dos.ny.gov/apostille-or-certificate-authentication)

## Process Outline

```mermaid
%% https://portal.311.nyc.gov/article/?kanumber=KA-01012
sequenceDiagram
    create participant Customer
    create participant VitalChek.com
    %% https://www.vitalchek.com/birth-certificates/new-york/new-york-city-dept-of-health-and-mental-hygiene
    Customer->>VitalChek.com: Order long-form cert
    VitalChek.com->>VitalChek.com: Processing
    destroy VitalChek.com
    VitalChek.com->>Customer: Receive long-form and exemplification
    create participant County Clerk
    %% https://portal.311.nyc.gov/article/?kanumber=KA-01029
    Customer->>County Clerk: Request signature verification
    County Clerk->>County Clerk: Processing
    destroy County Clerk
    County Clerk->>Customer: Receive signature verification
    create participant NY Dept of State
    %% https://dos.ny.gov/apostille-or-certificate-authentication
    Customer->>NY Dept of State: Request Apostille
    NY Dept of State->>NY Dept of State: Processing
    destroy NY Dept of State
    NY Dept of State->>Customer: Receive Apostille
```

