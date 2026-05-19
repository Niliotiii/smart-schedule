# Quickstart: Dashboard Signal Access

**Date**: 2026-05-18

## Integration Scenarios

### 1. User accesses signalling from Dashboard

1. User logs in and lands on Dashboard
2. Sees "Sinalizar" card (matching the existing Escalas/Usuários/Perfis card pattern)
3. Clicks card → redirected to `/schedules/signals`
4. Page shows all schedules from all months with status "disponivel", grouped by month
5. User clicks "Sim" or "Não" per schedule → existing signal endpoint called
6. Success toast shown, button state updates

### 2. No months available for signalling

1. User navigates to `/schedules/signals` (via dashboard card or direct URL)
2. Page displays: "Nenhuma escala disponível para sinalização no momento"
3. No signal buttons shown

### 3. Admin views schedules index (regression)

1. Admin navigates to `/schedules/months`
2. Row actions column no longer has the flag (signal) icon button
3. All other buttons (view, edit) remain unchanged
