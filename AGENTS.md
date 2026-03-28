# Codex Rules

## Frontend Structure
- Keep page files thin. Pages should compose sections and bind composables, not hold large templates plus business logic together.
- Extract distinct UI areas into components under `app/components/<feature>/`. For CRUD screens, prefer separate header, table/list section, and dialog/form components.
- Put feature state, data loading, mutations, pagination, and view actions in composables under `app/composables/`. Prefer one feature composable per page-level workflow, for example `useProductsPage`.
- Keep shared request/response contracts in `app/model/` and API callers in `app/utils/apiCalling.ts`.
- When using Element Plus, keep Element Plus-specific rendering inside components and keep composables UI-library agnostic except for lightweight feedback utilities such as `ElMessage` when practical.

## CRUD Screen Pattern
- Use page shell -> section component(s) -> dialog component.
- Use dialog-based create/edit forms for admin CRUD screens unless the existing product requirement clearly prefers inline forms.
- Use `el-table` for list rendering and `el-pagination` for paginated display.
- Keep dialog form state centralized in the page composable and pass it to form/dialog components via props and `update:*` events.

## Refactor Preference
- When touching an existing feature page that mixes template and logic heavily, refactor toward components plus composables as part of the same change instead of adding more code into the page file.
