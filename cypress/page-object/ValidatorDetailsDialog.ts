export class ValidatorDetailsDialog {
  getValidatorName(): string {
    return '[data-cy="details-dialog-validator-name"]';
  }

  getAddressTooltipTagHash(): string {
    return '[data-cy="address-copy-tooltip-tag-hash"]';
  }

  getVotingPowerValue(): string {
    return '[data-cy="validator-detail-dialog-voting-power"]';
  }
}