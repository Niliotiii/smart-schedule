import { computed, provide, inject, type InjectionKey, type ComputedRef } from 'vue'
import { usePage } from '@inertiajs/vue3'

export interface FormValidationState {
  tabsWithErrors: ComputedRef<Set<number>>
  getFieldError: (field: string) => string | undefined
  hasTabError: (tabIndex: number) => boolean
}

const FormValidationKey: InjectionKey<FormValidationState> = Symbol('formValidation')

export function useFormValidation(
  form: Record<string, any> & { errors?: Record<string, string> },
  tabMap?: Record<string, number>
): FormValidationState {
  const page = usePage()

  const allErrors = computed<Record<string, string>>(() => {
    const pageErrors = (page.props.errors as Record<string, string> | undefined) || {}
    const formErrors = form.errors || {}
    return { ...pageErrors, ...formErrors }
  })

  const tabsWithErrors = computed(() => {
    const tabs = new Set<number>()
    if (!tabMap || !allErrors.value) return tabs
    for (const errorKey of Object.keys(allErrors.value)) {
      for (const [field, tabIndex] of Object.entries(tabMap)) {
        if (errorKey === field || errorKey.startsWith(`${field}.`)) {
          tabs.add(tabIndex)
        }
      }
    }
    return tabs
  })

  const getFieldError = (field: string) => {
    return allErrors.value[field]
  }

  const hasTabError = (tabIndex: number) => {
    return tabsWithErrors.value.has(tabIndex)
  }

  const state: FormValidationState = {
    tabsWithErrors,
    getFieldError,
    hasTabError,
  }

  provide(FormValidationKey, state)

  return state
}

export function useFormValidationInject(): FormValidationState {
  return inject(FormValidationKey, {
    tabsWithErrors: computed(() => new Set<number>()),
    getFieldError: () => undefined,
    hasTabError: () => false,
  })
}
