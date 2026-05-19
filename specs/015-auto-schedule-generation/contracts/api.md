# API Contracts: Geração Automática de Escalas

## POST /schedules/months/:openedMonthId/generate

Trigger automatic schedule generation for a month. This endpoint replaces all existing assignments for the month.

**Auth**: Requires `scheduleMonthsManage` permission (Bouncer policy)

**Response**: Redirects back to the edit page with flash messages

### Success (200)

```json
{
  "success": "Escalas geradas com sucesso",
  "summary": {
    "totalSlots": 45,
    "filledSlots": 42,
    "unfilledSlots": 3,
    "unfilledDetails": [
      { "day": 11, "scheduleName": "Missa 2", "role": "Acólito", "missingQuantity": 2 },
      { "day": 18, "scheduleName": "Missa 1", "role": "Coroinha", "missingQuantity": 1 }
    ]
  }
}
```

### Error (400 - Validation)

Redirects back with error flash.

## GET /schedules/months/:openedMonthId/edit

Modified to include assignments in the month data.

**Additional data** (beyond existing):

```json
{
  "month": {
    "schedules": [
      {
        "assignments": [
          {
            "id": 1,
            "userId": 5,
            "userName": "João Silva",
            "ministryRoleId": 3,
            "ministryRoleName": "Acólito"
          }
        ]
      }
    ]
  }
}
```
