/*
|--------------------------------------------------------------------------
| Validator file
|--------------------------------------------------------------------------
|
| The validator file is used for configuring global transforms for VineJS.
| The transform below converts all VineJS date outputs from JavaScript
| Date objects to Luxon DateTime instances, so that validated dates are
| ready to use with Lucid models and other parts of the app that expect
| Luxon DateTime.
|
*/

import { DateTime } from 'luxon'
import { VineDate } from '@vinejs/vine'
import { SimpleMessagesProvider } from '@vinejs/vine'
import { RequestValidator } from '@adonisjs/core/http'

declare module '@vinejs/vine/types' {
  interface VineGlobalTransforms {
    date: DateTime
  }
}

VineDate.transform((value) => DateTime.fromJSDate(value))

/*
|--------------------------------------------------------------------------
| Global Portuguese messages provider
|--------------------------------------------------------------------------
|
| Configures VineJS validation messages and field labels globally
| to use Portuguese translations for all forms.
|
*/

const messages = {
  required: 'O campo {{ field }} é obrigatório',
  email: 'O {{ field }} deve ser um endereço de email válido',
  minLength: 'O campo {{ field }} deve ter pelo menos {{ min }} caracteres',
  maxLength: 'O campo {{ field }} deve ter no máximo {{ max }} caracteres',
  positive: 'Selecione um valor válido para o campo {{ field }}',
  regex: 'O campo {{ field }} não está no formato correto',
  number: 'O campo {{ field }} deve ser um número',
  boolean: 'O campo {{ field }} deve ser verdadeiro ou falso',
  string: 'O campo {{ field }} deve ser um texto',
  sameAs: 'As senhas não conferem',
  unique: 'O valor informado para o campo {{ field }} já está em uso',
  array: 'O campo {{ field }} deve ser uma lista',
  date: 'O campo {{ field }} deve ser uma data válida',
  notIn: 'O campo {{ field }} possui um valor inválido',
  min: 'O campo {{ field }} deve ser no mínimo {{ min }}',
  max: 'O campo {{ field }} deve ser no máximo {{ max }}',
  distinct: 'O campo {{ field }} deve conter valores distintos',
  fixedLength: 'O campo {{ field }} deve ter exatamente {{ length }} caracteres',
  confirmed: 'O campo {{ field }} não confere',
}

const fields: Record<string, string> = {
  email: 'email',
  password: 'senha',
  passwordConfirmation: 'confirmação de senha',
  fullName: 'nome completo',
  full_name: 'nome completo',
  name: 'nome',
  phone: 'telefone',
  description: 'descrição',
  postalCode: 'CEP',
  postal_code: 'CEP',
  countryId: 'país',
  country_id: 'país',
  stateId: 'estado',
  state_id: 'estado',
  cityId: 'cidade',
  city_id: 'cidade',
  neighborhood: 'bairro',
  street: 'rua',
  number: 'número',
  complement: 'complemento',
  latitude: 'latitude',
  longitude: 'longitude',
  profileId: 'perfil',
  profile_id: 'perfil',
  userTypeId: 'tipo de usuário',
  user_type_id: 'tipo de usuário',
  birthDate: 'data de nascimento',
  birth_date: 'data de nascimento',
  birthCountryId: 'país de nascimento',
  birth_country_id: 'país de nascimento',
  birthStateId: 'estado de nascimento',
  birth_state_id: 'estado de nascimento',
  birthCityId: 'cidade de nascimento',
  birth_city_id: 'cidade de nascimento',
  responsible1Name: 'nome do responsável 1',
  responsible1Phone: 'telefone do responsável 1',
  responsible2Name: 'nome do responsável 2',
  responsible2Phone: 'telefone do responsável 2',
  includeInScale: 'incluir na escala',
  communityId: 'comunidade',
  community_id: 'comunidade',
  ministryRoleIds: 'funções ministeriais',
  ministry_role_ids: 'funções ministeriais',
  sacramentTypeId: 'tipo de sacramento',
  sacrament_type_id: 'tipo de sacramento',
  receivedDate: 'data de recebimento',
  receivedChurch: 'igreja de recebimento',
  receivedCountryId: 'país de recebimento',
  receivedStateId: 'estado de recebimento',
  receivedCityId: 'cidade de recebimento',
}

RequestValidator.messagesProvider = () => new SimpleMessagesProvider(messages, fields)
