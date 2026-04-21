# Data Model: Alternância de Tema Claro/Escuro

**Feature**: 003-dark-light-theme
**Date**: 2026-04-20

## Entities

### Theme Preference (client-side only)

| Field | Type                           | Description                                        |
| ----- | ------------------------------ | -------------------------------------------------- |
| theme | string (`"light"` \| `"dark"`) | Preferência do usuário, armazenada em localStorage |

**Storage**: localStorage (chave: `theme`)
**Default**: Se ausente, detecta via `prefers-color-scheme`. Se indisponível, `"light"`.

## Notes

Nenhuma mudança no banco de dados. A preferência de tema é inteiramente client-side (localStorage). Não há relacionamento com entidades existentes (User, Profile, Permission).
