import { Button } from './Button'

interface CreateOrganizationButtonProps {
  onClick?: () => void;
}

export function CreateOrganizationButton({ onClick }: CreateOrganizationButtonProps) {
  return (
    <Button 
      onClick={onClick}
      variant="primary"
      title="Create a new organization"
    >
      + New Organization
    </Button>
  );
}
