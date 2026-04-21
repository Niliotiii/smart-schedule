# Quickstart: Alternância de Tema Claro/Escuro

**Feature**: 003-dark-light-theme
**Date**: 2026-04-20

## Integration Scenarios

### Scenario 1: Usuário alterna tema pela primeira vez

1. Usuário acessa qualquer página do sistema
2. Sistema detecta preferência do SO (ou usa claro como padrão)
3. Usuário clica no botão de tema na navbar (ícone de sol ou lua)
4. Tema muda instantaneamente; preferência salva em localStorage
5. Ao navegar para outra página, o tema persiste

### Scenario 2: Usuário retorna em nova sessão

1. Usuário abre o navegador e acessa o sistema
2. Script inline no `<head>` lê localStorage antes da renderização
3. Classe `.dark` é aplicada no `<html>` se necessário (sem FOUC)
4. Página carrega com o tema correto

### Scenario 3: Usuário não autenticado na tela de login

1. Usuário acessa `/login`
2. Tela de login carrega com tema de acordo com localStorage ou preferência do SO
3. Botão de tema disponível no canto superior direito
4. Após login, a preferência é mantida

## Test Checklist

- [ ] Abrir a tela de login — tema respeita preferência salva ou do SO
- [ ] Clicar no botão de tema na navbar — alterna entre claro e escuro
- [ ] Recarregar a página — tema persiste sem flash
- [ ] Navegar entre páginas — tema mantido
- [ ] Fechar navegador, reabrir — tema persiste
- [ ] Verificar todos os componentes: sidebar, navbar, tabela, formulário, badges, alertas, botões — todos legíveis em ambos os temas
- [ ] Abrir em segunda aba — tema sincronizado ao recarregar/focar
