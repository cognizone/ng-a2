export const ALERTS = {
  fail_general: 'Something went wrong',
  not_authorized: 'Not Authorized',
  not_authenticated: 'Not Authenticated',
  no_response_status_unknown: 'No response/Unknown error',
  no_response_status: 'No response',
  fail_start_export: 'Can not start export',
  fail_fetch_major_version: 'Can not fetch major esco versions',
  fail_authentication: 'An error occured during authentication',

  fail_load_efforts: 'Could not load mapping efforts',
  fail_load_effort: 'Could not load mapping effort',
  fail_load_concept_scheme: 'Could not load concept scheme',
  fail_load_concept_scheme_label: 'Could not load concept scheme label',
  fail_load_concept: 'Could not load concept',
  fail_load_suggestion: 'Could not get suggestions',
  fail_load_mappings: 'Could not load mappings',
  fail_load_conceptMappingState: 'Could not load mapping state of concept',
  fail_mapping_action: 'Could not update mapping',
  fail_import_mappings: 'Could not import mappings',
  fail_set_conceptMappingStatus: 'Could not set concept mapping status',
  fail_add_comment: 'Could not add comment',
  fail_edit_comment: 'Could not edit comment',
  fail_remove_comment: 'Could not remove comment',
  fail_load_concept_mapping_states: 'Could not load concept mapping states',

  fail_download_mappings: 'Could not download mappings',
  fail_delete_mappings: 'Could not delete mappings',
  no_session: 'User was not logged in, redirecting to login ...',

  warn_no_mapping:
    'You are trying to indicate as having no mappings a concept that was previously mapped with another concept. Please remove these mappings if you wish to proceed.',
  warn_no_mapping_r:
    'You are trying to map a concept that was previously indicated as having no possible mappings. Please remove this indication if you wish to proceed.',
  fail_search: 'Search failed',
  user_is_missing_roles: `This user doesn't have any roles assigned. Please ask the administrator to assign roles to this user.`,
} as const;