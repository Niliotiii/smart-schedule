# Implementation Plan: form-validation-feedback

**Branch**: `012-form-validation-feedback` | **Date**: 2026-04-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/012-form-validation-feedback/spec.md`

## Summary

Implementar feedback visual centralizado e unificado para todos os formulários do sistema. Atualmente, cada campo repete manualmente o padrão `:invalid="!!form.errors.field"` com `<Message v-if="form.errors.field">`. Esta tarefa cria um composable reutilizável que detecta campos inválidos e destaca não apenas os inputs, mas também os títulos das abas (`TabPanel`) que contêm erros. O objetivo é aplicar o padrão de validação visual a **todos os formulários existentes** (Users, Churches, Priests, Profiles, MinistryRoles, UserTypes) sem duplicar código.

## Technical Context

**Language/Version**: TypeScript / Vue 3.5 / Inertia.js 2.3  
**Primary Dependencies**: PrimeVue 4.5.5 (`TabView`, `TabPanel`, `InputText`, `Message`, `FloatLabel`), `@inertiajs/vue3` (`useForm`), `vue` (`computed`, `watch`)  
**Storage**: N/A (frontend-only)  
**Testing**: Vitest (já configurado no projeto)  
**Target Platform**: Browser (desktop + mobile) — aplicação Inertia.js monolito AdonisJS  
**Project Type**: Web application (Inertia.js + AdonisJS monolith)  
**Performance Goals**: Remoção de destaque em <300ms após correção  
**Constraints**: Suporte a temas claro/escuro (as cores de erro devem respeitar o tema PrimeVue); sem uso de biblioteca de validação adicional no frontend (o backend VineJS já fornece os erros via `useForm.errors`)  
**Scale/Scope**: ~7 formulários existentes, reutiliza composable

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle | Check | Notes |
|-----------|-------|-------|
| Extensibilidade e Arquitetura Modular | PASS | Composable reutilizável não acopla a nenhum ministério específico |
| Simplicidade e Usabilidade | PASS | Feedback visual direto melhora a usabilidade para coordenadores/voluntários |
| Confiabilidade e Tolerância a Falhas | PASS | Não altera o algoritmo de escalonamento |
| Segurança e Privacidade | PASS | Sem alteração em controle de acesso |

## Project Structure

### Documentation (this feature)

```text
specs/012-form-validation-feedback/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
resources/js/
├── Composables/
│   └── useFormValidation.ts   # NOVO: detecta erros de campo e abas, expõe estado
├── Components/
│   ├── FormField.vue            # NOVO: wrapper de campo com label + erro + invalid state
│   └── TabPanelError.vue        # NOVO: wrapper de TabPanel que destaca header em vermelho
└── Pages/
    ├── Users/Form.vue           # MODIFICADO: usar FormField e TabPanelError
    ├── Churches/Form.vue        # MODIFICADO
    ├── Priests/Form.vue         # MODIFICADO
    ├── Profiles/Form.vue        # MODIFICADO
    ├── MinistryRoles/Form.vue   # MODIFICADO
    ├── UserTypes/Form.vue       # MODIFICADO
    └── Auth/Login.vue           # MODIFICADO (sem abas, apenas FormField)
```

**Structure Decision**: O projeto já é uma aplicação Inertia.js monolito com Vue 3. A solução será implementada como composable + components Vue, reutilizáveis por todos os formulários existentes. Nenhuma alteração de backend ou storage é necessária.

## Complexity Tracking

Nenhuma violação da constituição identificada.
