// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
export const CHANGE_CATEGORY = {
  buttonCancel: '[data-testid=cancelSubcategoryButton]',
  buttonEdit: '[data-testid=editSubcategoryButton]',
  buttonSubmit: '[data-testid=submitSubcategoryButton]',
  inputCategory: '[data-testid=input]',
};

export const CHANGE_LOCATION = {
  buttonCancel: '[data-testid=cancelBtn]',
  buttonEdit: '[data-testid="editLocationButton"]',
  buttonLocationDetailEdit: '[data-testid=location-preview-button-edit]',
  buttonSubmit: '[data-testid=submitBtn]',
  map: '[data-testid="mapInput"]',
};

export const CHANGE_STATUS = {
  buttonCancel: '[data-testid=statusFormCancelButton]',
  buttonEdit: '[data-testid=editStatusButton]',
  buttonSubmit: '[data-testid=statusFormSubmitButton]',
  checkboxSendEmail: '[data-testid="sendEmailCheckbox"]',
  currentStatus: '[data-testid="currentStatus"]',
  inputToelichting: '[data-testid=text]',
  radioButtonGemeld: '[data-testid=status-m]',
  radioButtonInAfwachting: '[data-testid=status-i]',
  radioButtonIngepland: '[data-testid=status-ingepland]',
  radioButtonInBehandeling: '[data-testid=status-b]',
  radioButtonExtern: '[data-testid="status-closure requested"]',
  radioButtonAfgehandeld: '[data-testid=status-o]',
  radioButtonHeropend: '[data-testid=status-reopened]',
  radioButtonGeannuleerd: '[data-testid=status-a]',
  statusNotification: '[data-testid="statusFormToelichting"]',
  warningDeelmeldingenOpen: '[data-testid="statusHasChildrenOpen"]',
};

export const CHANGE_TYPE = {
  buttonCancel: '[data-testid=cancelTypeButton]',
  buttonEdit: '[data-testid=editTypeButton]',
  buttonSubmit: '[data-testid=submitTypeButton]',
  radioButtonMelding: '[data-testid=input-SIG]',
  radioButtonAanvraag: '[data-testid=input-REQ]',
  radioButtonVraag: '[data-testid=input-QUE]',
  radioButtonKlacht: '[data-testid=input-COM]',
  radioButtonGrootOnderhoud: '[data-testid=input-MAI]',
};

export const CHANGE_URGENCY = {
  buttonCancel: '[data-testid=cancelPriorityButton]',
  buttonEdit: '[data-testid=editPriorityButton]',
  buttonSubmit: '[data-testid=submitPriorityButton]',
  radioButtonHoog: '[data-testid=input-high]',
  radioButtonLaag: '[data-testid=input-low]',
  radioButtonNormaal: '[data-testid=input-normal]',
};

export const DEELMELDING = {
  buttonAdd: '[data-testid="incidentSplitFormIncidentSplitButton"]',
  buttonCancel: '[data-testid="incidentSplitFormCancelButton"]',
  buttonEditDirectingDepartment: '[data-testid="editDirecting_departmentsButton"]',
  buttonNoAction: '[data-testid="noActionButton"]',
  buttonSubmit: '[data-testid="incidentSplitFormSubmitButton"]',
  buttonSubmitDirectingDepartment: '[data-testid="submitDirecting_departmentsButton"]',
  childIncident: '[class*="ChildIncidents__Li"]',
  childIncidents: '[data-testid="childIncidents"]',
  disclaimer: '[data-testid="splitFormBottomDisclaimer"]',
  dropdownSubcategory01: '[data-testid="part1.subcategory"]',
  dropdownSubcategory02: '[data-testid="part2.subcategory"]',
  dropdownSubcategory03: '[data-testid="part3.subcategory"]',
  inputDeelmeldingDescription02: '[data-testid="incidentSplitFormIncidentDescriptionText-2"]',
  inputDeelmeldingDescription03: '[data-testid="incidentSplitFormIncidentDescriptionText-3"]',
  inputNote: '[data-testid="incidentSplitFormParentIncidentNote"]',
  labelDescription02: '[for="description-2"]',
  labelDescription03: '[for="description-3"]',
  linkParent: '[data-testid="parentLink"]',
  messageLabel: '[role="alert"]',
  notification: '[data-testid="notification"]',
  radioButtonASC: '#department-ASC',
  radioButtonVerantwoordelijkeAfdeling: '#department-null',
  radioButtonEditASC: '[data-testid="input-ASC"]',
  radioButtonEditVerantwoordelijkeAfdeling: '[data-testid="input-null"]',
  titleDeelmelding: '[data-testid="incidentSplitFormIncidentTitle"]',
};

export const SIGNAL_DETAILS = {
  addressCity: '[data-testid="location-value-address-city"]',
  addressStreet: '[data-testid="location-value-address-street"]',
  buttonAddNote: '[data-testid=addNoteNewNoteButton]',
  buttonCancel: '[data-testid=cancelButton]',
  buttonCancelNote: '[data-testid=addNoteCancelNoteButton]',
  buttonCloseImageViewer: '[data-testid=closeButton]',
  buttonCreateDeelmelding: '[data-testid="detail-header-button-split"]',
  buttonEdit: '[data-testid="editButton"]',
  buttonSaveNote: '[data-testid=addNoteSaveNoteButton]',
  buttonSubmit: '[data-testid=submitButton]',
  buttonTHOR: '[data-testid=detail-header-button-thor]',
  creationDate: '[data-testid=meta-list-date-value]',
  deelmeldingBlock: '[data-testid="childIncidents"] > li',
  deelmeldingBlockValue: '[class*="ChildIncidents__DisplayValue"]',
  deelmeldingen: '[data-testid="childIncidents"]',
  descriptionText: '[data-testid="detail-title"]',
  directingDepartment: '[data-testid="meta-list-directing_departments-value"]',
  doorlooptijd: '[data-testid=meta-list-process-time-value]',
  email: '[data-testid="detail-email-value"]',
  errorMessage: '[data-testid="error"]',
  handlingTime: '[data-testid="meta-list-handling-time-value"]',
  historyAction: '[data-testid="history-list-item-action"]',
  historyListItem: '[data-testid="history-list-item-description"]',
  imageLocation: '[data-testid=mapStaticImage]',
  infoText: '[data-testid=infoText]',
  inputNoteText: '[data-testid=addNoteText]',
  ktoAmounts: '[data-testid=detail-context-value] > div',
  labelDoorlooptijd: '[data-testid=meta-list-process-time-definition]',
  labelEmail: '[data-testid=detail-email-definition]',
  labelLocatie: '[data-testid=detail-location]',
  labelMeldigenMelder: '[data-testid="detail-context-definition"]',
  labelOverlast: '[class*=Detail__DefinitionList] > :nth-child(1)',
  labelTelefoon: '[data-testid=detail-phone-definition]',
  labelToestemming: '[data-testid=detail-sharing-definition]',
  linkMeldingenMelder: '[data-testid="detail-context-value"] > a',
  linkParent: '[data-testid=meta-list-parent-link]',
  linkTerugNaarOverzicht: '[data-testid=backlink]',
  mainCategory: '[data-testid="meta-list-main-category-value"]',
  phoneNumber: '[data-testid="detail-phone-value"]',
  photo: '[data-testid="attachmentsValueButton"]',
  photoViewerImage: '[data-testid="attachment-viewer-image"]',
  regie: '[data-testid=meta-list-directing_departments-value] > [data-testid=valuePath]',
  shareContactDetails: '[data-testid="detail-sharing-value"]',
  signalHeaderTitle: '[data-testid=detail-header-title]',
  signalId: '[data-testid=detail-header-title] > span',
  source: '[data-testid="meta-list-source-value"]',
  stadsdeel: '[data-testid="location-value-address-district"]',
  status: '[data-testid="meta-list-status-value"]',
  subCategory: '[data-testid="meta-list-subcategory-value"]',
  titleDeelmelding: '[class*= ChildIncidents__Title]',
  type: '[data-testid="meta-list-type-value"]',
  urgency: '[data-testid="meta-list-priority-value"]',
};
