# Feature Specification: Church Registration

**Feature Branch**: `007-church-registration`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User description: "Quero poder cadastrar comunidades (igrejas), os dados devem ser nome(*), cep(*), país(*), estado(*), cidade(*), bairro(*), logradouro(*), número(*), complemento, latitude, longitude. Crie uma aba só para os dados de endereço e tenha uma tabela especializada para endereço tendo em vista que poderá ter outras entidades futuras com o mesmo padrão de dados. Tenha uma tabela de países já populada, uma tabela de estados já populada, uma tabela de cidades já populada (use dados do IBGE para popular). Implemente a API dos Correios e ViaCEP (fallback) para identificar o endereço pelo CEP. Implemente também o OpenStreetMap para tentar obter as latitudes e longitudes através do endereço."

## User Scenarios & Testing _(mandatory)_

### User Story 1 – Register a New Church (Priority: P1)

As an administrator, I want to register a new church so that it can be managed within the system.

**Why this priority**: This is the core feature. Without church registration, there is no foundational entity for scheduling and other downstream features.

**Independent Test**: A user can fill out a church registration form, save it, and see the new church listed in the churches table. The record persists across sessions.

**Acceptance Scenarios**:

1. **Given** the user is on the church registration form, **When** they enter the church name and all required address fields (CEP, country, state, city, neighborhood, street, number), **Then** the church is saved successfully and displayed in the list.
2. **Given** the user enters a valid Brazilian CEP in the address tab, **When** the system queries the CEP lookup service, **Then** the fields for street, neighborhood, city, and state are auto-filled.
3. **Given** the primary CEP service is unavailable, **When** the user enters a CEP, **Then** the fallback service is used and the address is still auto-populated.

---

### User Story 2 – Auto-complete Address via CEP (Priority: P1)

As an administrator registering a church, I want the system to fill in address fields automatically when I enter a CEP, so that data entry is faster and more accurate.

**Why this priority**: Reduces manual entry errors and significantly speeds up the registration workflow. Address accuracy is critical for future geolocation features.

**Independent Test**: Entering a known CEP populates street, neighborhood, city, and state without manual typing.

**Acceptance Scenarios**:

1. **Given** the user enters a valid CEP, **When** the lookup service returns a match, **Then** all corresponding address fields are automatically filled.
2. **Given** the user enters an invalid CEP, **When** the lookup service returns no match, **Then** the system displays a clear message and allows manual entry.
3. **Given** the primary CEP service fails, **When** the user requests address lookup, **Then** the system attempts the fallback service before showing an error.

---

### User Story 3 – Geolocation via OpenStreetMap (Priority: P2)

As an administrator, I want the system to automatically obtain latitude and longitude for a church address, so that the church can be mapped and used for distance-based features.

**Why this priority**: Adds significant value for users needing directions or proximity searches, but is secondary to basic registration and address auto-completion.

**Independent Test**: After a church is saved with a valid address, its latitude and longitude are populated in the database.

**Acceptance Scenarios**:

1. **Given** a church address is fully filled (street, number, neighborhood, city, state, country), **When** the system queries the geolocation service, **Then** latitude and longitude are stored successfully.
2. **Given** the geolocation service returns multiple results for an address, **When** the system processes them, **Then** the most relevant result is used.
3. **Given** the geolocation service is unavailable or the address cannot be found, **When** the query is attempted, **Then** latitude and longitude remain empty and the user receives a non-blocking warning.

---

### User Story 4 – Manage Reference Data (Priority: P3)

As a system, I want to maintain lists of countries, states, and cities (pre-populated with IBGE data) so that users can select standardized values when registering churches.

**Why this priority**: Ensures data consistency and powers the cascading selectors for state and city. It also enables future entities to reuse the same reference data.

**Independent Test**: The system already contains the complete list of Brazilian states and cities from IBGE upon deployment.

**Acceptance Scenarios**:

1. **Given** the user opens the church registration form, **When** they interact with the address tab, **Then** the country dropdown contains all pre-populated countries, with Brazil as the default.
2. **Given** Brazil is selected as the country, **When** the user opens the state dropdown, **Then** all Brazilian states (UFs) from IBGE are listed.
3. **Given** a state is selected, **When** the user opens the city dropdown, **Then** all IBGE cities corresponding to that state are listed.

---

### Edge Cases

- **What happens when a CEP is valid but the returned data is incomplete?** The system should fill whatever is returned and leave the remaining fields blank, allowing manual correction.
- **What if the user manually overrides auto-completed address fields?** Manual changes must be preserved and not overwritten by the system unless the user re-triggers a CEP lookup.
- **How does the system handle an address that cannot be geolocated?** Latitude and longitude remain null; the church is still saved; a subtle warning is shown.
- **What happens if a user registers a church outside of Brazil?** The CEP auto-complete is skipped for non-Brazilian addresses; the remaining address fields are filled manually.
- **Duplicate CEP lookups**: If the user enters the same CEP multiple times, the system should not re-query but may re-populate fields that were manually cleared.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Users MUST be able to register a new church with a name and a complete address.
- **FR-002**: The registration form MUST have a dedicated tab for address data, clearly separated from general church information.
- **FR-003**: The address MUST be stored in a reusable, standalone data structure (e.g., an address table or equivalent) so future entities can share the same pattern without duplication.
- **FR-004**: The system MUST pre-populate a reference table of countries with at least all sovereign nations, defaulting the UI dropdown to Brazil.
- **FR-005**: The system MUST pre-populate a reference table of Brazilian states (UFs) using official IBGE data.
- **FR-006**: The system MUST pre-populate a reference table of Brazilian cities using official IBGE data, linked to their respective states.
- **FR-007**: When a valid Brazilian CEP is entered, the system MUST automatically query an address lookup service and fill the street, neighborhood, city, and state fields.
- **FR-008**: The CEP lookup MUST attempt the primary provider first, and transparently fall back to a secondary provider upon timeout or error.
- **FR-009**: When a complete address (street, number, neighborhood, city, state, country) is provided, the system MUST attempt to resolve latitude and longitude via a geolocation service.
- **FR-010**: If geolocation fails or returns no results, the church MUST still be saved normally and latitude/longitude remain optional.
- **FR-011**: The state and city selectors MUST be hierarchical (city list filtered by selected state).
- **FR-012**: Users MUST be able to manually edit all auto-filled address fields before saving.
- **FR-013**: The system MUST validate that all mandatory fields (name, CEP, country, state, city, neighborhood, street, number) are present before allowing the church to be saved.

### Key Entities _(include if feature involves data)_

- **Church**: Represents a religious community or congregation. Key attributes are its name and a relationship to one Address record.
- **Address**: A reusable, normalized structure for physical locations. Attributes include CEP, country, state, city, neighborhood, street, number, complement, latitude, and longitude. Future entities will link to Address rather than duplicating the same fields.
- **Country**: Reference data of sovereign nations. Pre-populated at setup time.
- **State**: Reference data of Brazilian federative units (UFs), sourced from IBGE. Pre-populated at setup time.
- **City**: Reference data of Brazilian municipalities, sourced from IBGE. Pre-populated at setup time and linked to State.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can complete a church registration, including address, in under 3 minutes on average.
- **SC-002**: 95% of valid Brazilian CEPs entered in the system result in correctly auto-filled address fields.
- **SC-003**: The address data model is reusable: at least one additional, unrelated entity type can adopt it without schema changes or field duplication.
- **SC-004**: Geolocation lookup provides non-null latitude/longitude for at least 80% of complete Brazilian addresses.
- **SC-005**: The system gracefully handles CEP lookup failure (both services down) with a clear user-facing message, and allows manual data entry to proceed.
- **SC-006**: All address-related reference data (countries, states, cities) loads from IBGE and seed files without manual intervention during deployment.

## Assumptions

- The product primarily serves congregations within Brazil, with international support available but not requiring IBGE data or Brazilian CEP lookup for non-Brazil countries.
- The system will have outbound internet access to call Correios, ViaCEP, and OpenStreetMap APIs.
- IBGE reference data will be sourced from official public endpoints or downloadable CSV/JSON files available at the time of implementation.
- Latitude and longitude are optional fields; the product does not require every church to be geolocated to function.
- The address table pattern (separating address from church) is a long-term architectural decision accepted by stakeholders.
