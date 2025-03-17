
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonText,
  buttonLink
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</p>
      <p className="mt-1 text-muted-foreground">{description}</p>
      <Button variant="outline" className="mt-4" onClick={() => navigate(buttonLink)}>
        {buttonText}
      </Button>
    </div>
  );
};

export default EmptyState;
