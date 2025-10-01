
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DockerTableSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const DockerTableSearch = ({ searchTerm, onSearchChange, onRefresh, isLoading }: DockerTableSearchProps) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <div className="relative flex-1 sm:flex-initial">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={t('searchContainersPlaceholder', 'docker')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 sm:w-64 bg-background border-border"
        />
      </div>
      <Button
        onClick={onRefresh}
        disabled={isLoading}
        variant="outline"
        size="default"
        className="w-full sm:w-auto bg-background border-border hover:bg-muted"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        <span className="sm:inline">{t('refresh', 'docker')}</span>
      </Button>
    </div>
  );
};