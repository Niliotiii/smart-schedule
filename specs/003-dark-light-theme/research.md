# Research: Alternância de Tema Claro/Escuro

**Feature**: 003-dark-light-theme
**Date**: 2026-04-20

## Decision 1: Estratégia de Dark Mode no Tailwind CSS v4

**Decision**: Usar estratégia de classe (`class`) com `@custom-variant dark (&:where(.dark, .dark *));` no CSS, aplicando a classe `.dark` no `<html>`.

**Rationale**: Tailwind CSS v4 mudou a forma de configurar dark mode. Em vez de `tailwind.config.js` com `darkMode: 'class'`, usa-se `@custom-variant` no CSS. A estratégia de classe (vs. `media`) permite que o usuário alterne manualmente, sobrescrevendo a preferência do SO. A variante `&:where(.dark, .dark *)` faz com que qualquer elemento descendente de `.dark` também aplique as classes `dark:`.

**Alternatives considered**:

- **Media query (`prefers-color-scheme`)**: Tailwind v4 usa isso por padrão. Problema: não permite alternância manual pelo usuário — apenas segue o SO.
- **Tailwind v3 `darkMode: 'class'`**: Não aplicável — projeto usa Tailwind v4 que não tem `tailwind.config.js`.

## Decision 2: Persistência da Preferência de Tema

**Decision**: Usar `localStorage` com chave `theme` para persistir a preferência entre sessões.

**Rationale**: localStorage é síncrono, simples, e pode ser lido antes da renderização do DOM (via script inline no `<head>`), prevenindo FOUC (Flash of Unstyled Content). Não requer mudanças no backend ou banco de dados.

**Alternatives considered**:

- **Cookie + backend**: Persistir no banco via campo no User. Rejeitado: aumenta complexidade sem benefício (tema é preferência visual, não dado de negócio). Também não funciona para usuários não autenticados (tela de login).
- **Apenas CSS `prefers-color-scheme`**: Rejeitado: não permite escolha manual do usuário.

## Decision 3: Prevenção de FOUC (Flash of Unstyled Content)

**Decision**: Adicionar script inline no `<head>` de todas as views, antes do `@vite()`, que lê localStorage e aplica a classe `.dark` no `<html>` antes da renderização.

**Rationale**: Se o script de tema rodar após a renderização, o usuário verá um flash do tema claro antes de o correto ser aplicado. O script inline síncrono no `<head>` garante que a classe correta seja aplicada antes do CSS ser carregado.

**Alternatives considered**:

- **`prefers-color-scheme` only no CSS**: Previne FOUC mas não permite alternância manual.
- **Script no final do `<body>`**: Causa FOUC — rejeitado.

## Decision 4: Detecção da Preferência do Sistema Operacional

**Decision**: Usar `window.matchMedia('(prefers-color-scheme: dark)')` como fallback quando não há valor em localStorage.

**Rationale**: Segue o padrão web para detecção de preferência do SO. Funciona em todos os navegadores modernos. A lógica de prioridade é: (1) localStorage → (2) prefers-color-scheme → (3) claro (padrão).

**Alternatives considered**:

- **Ignorar preferência do SO**: Rejeitado: a spec (US3) exige que o sistema respeite a preferência do SO na primeira visita.

## Decision 5: Onde Colocar o Botão de Alternância

**Decision**: Botão de alternância na navbar, ao lado das informações do usuário, usando ícone de sol (tema claro) / lua (tema escuro).

**Rationale**: A navbar está presente em todas as páginas autenticadas e é o local padrão para controles de preferência de interface (seguindo padrões de GitHub, Discord, etc.). Para a tela de login, o botão será posicionado no canto superior direito.

**Alternatives considered**:

- **No sidebar**: Menos visível e acessível em mobile (sidebar fica oculta).
- **No footer**: Não visível sem scroll, viola o requisito de acesso rápido.

## Decision 6: Classes Dark para Componentes Específicos

**Decision**: Adicionar manualmente classes `dark:` em cada view Edge, sem abstrair em components de layout compartilhado (sem master layout Edge).

**Rationale**: O projeto não usa um layout master — cada view é independente com seu próprio `<!DOCTYPE html>`. Isso é consistente com a arquitetura atual. A duplicação do script inline no `<head>` é aceitável dado o número pequeno de views. Se o projeto crescer, pode-se criar um layout master Edge depois.

**Alternatives considered**:

- **Criar layout master Edge agora**: Rejeitado: é um refactor grande fora do escopo desta feature. Mantém o princípio de não adicionar abstrações além do necessário.
