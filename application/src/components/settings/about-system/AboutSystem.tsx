import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, FileText, Twitter, MessageCircle, Code2, ServerIcon, FolderOpen, Database, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { pb } from "@/lib/pocketbase";
import { toast } from "@/components/ui/use-toast";

export const AboutSystem: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { systemName } = useSystemSettings();
  const [isImporting, setIsImporting] = useState(false);
  const [mergeFields, setMergeFields] = useState(true);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    created: number;
    updated: number;
    skipped: number;
  } | null>(null);

  // Helper function to check if a collection is a system collection
  const isSystemCollection = (name: string): boolean => {
    return name.startsWith('_') || ['users'].includes(name);
  };

  // Helper function to validate collection schema
  const validateCollectionSchema = (collection: any): string | null => {
    if (!collection.name) return "Collection name is required";
    if (typeof collection.name !== 'string') return "Collection name must be a string";
    if (!/^[a-z][a-z0-9_]*$/.test(collection.name)) {
      return "Collection name must start with a letter and contain only lowercase letters, numbers, and underscores";
    }
    if (collection.name.length < 3 || collection.name.length > 32) {
      return "Collection name must be between 3 and 32 characters";
    }

    // Validate schema array if present
    if (collection.schema && !Array.isArray(collection.schema)) {
      return "Collection schema must be an array";
    }

    // Validate each field in the schema
    if (collection.schema) {
      for (const field of collection.schema) {
        if (!field.name || typeof field.name !== 'string') {
          return `Invalid field name in collection '${collection.name}'`;
        }
        if (!field.type || typeof field.type !== 'string') {
          return `Invalid field type for '${field.name}' in collection '${collection.name}'`;
        }
      }
    }

    return null;
  };

  const handleSchemaImport = async (schemaData: string) => {
    if (!schemaData.trim()) {
      toast({
        title: "Error",
        description: "No schema data provided",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsImporting(true);
      setImportResult(null);
      
      // Parse the JSON to validate it
      const collections = JSON.parse(schemaData);
      
      if (!Array.isArray(collections)) {
        throw new Error("Schema must be an array of collections");
      }

      // Check if user is authenticated as admin
      if (!pb.authStore.isValid) {
        throw new Error("Authentication required. Please log in as an admin.");
      }
      // Create/update collections one by one using PocketBase client
      let successCount = 0;
      let errorCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;
      const errors = [];

      for (const collection of collections) {
        try {
          // Skip system collections
          if (isSystemCollection(collection.name)) {
            skippedCount++;
            continue;
          }

          // Validate collection schema
          const validationError = validateCollectionSchema(collection);
          if (validationError) {
            throw new Error(validationError);
          }
          // Check if collection already exists
          const existingCollections = await pb.collections.getFullList();
          const existingCollection = existingCollections.find(c => c.name === collection.name);
          
          if (existingCollection) {
            if (mergeFields) {
              
              try {
                // Get existing schema
                const existingSchema = existingCollection.schema || [];
                const newSchema = collection.schema || [];
                // Merge schemas - add new fields, keep existing ones
                const mergedSchema = [...existingSchema];
                let fieldsAdded = 0;
                
                for (const newField of newSchema) {
                  const existingFieldIndex = mergedSchema.findIndex(f => f.name === newField.name);
                  if (existingFieldIndex >= 0) {
                  } else {
                    // Add new field
                    mergedSchema.push(newField);
                    fieldsAdded++;
                  }
                }
                
                // Update the collection with merged schema
                const updateData = {
                  ...collection,
                  schema: mergedSchema
                };
                
                const updatedCollection = await pb.collections.update(existingCollection.id, updateData);
                updatedCount++;
              } catch (mergeError) {
                throw new Error(`Failed to merge fields: ${mergeError.message || mergeError}`);
              }
            } else {
              skippedCount++;
              continue;
            }
          } else {
            // Create new collection
            try {
              const newCollection = await pb.collections.create(collection);
              successCount++;
            } catch (createError) {
            
              // Extract more detailed error information
              let errorMessage = createError.message || createError;
              if (createError.data) {
                // Try to extract field-specific errors
                if (createError.data.data) {
                  const fieldErrors = Object.entries(createError.data.data).map(([field, msgs]) => 
                    `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
                  ).join('; ');
                  if (fieldErrors) {
                    errorMessage += ` - Field errors: ${fieldErrors}`;
                  }
                }
              }
              
              throw new Error(`Failed to create collection: ${errorMessage}`);
            }
          }
        } catch (error) {
          errorCount++;
          const errorMsg = `Failed to process collection '${collection.name}': ${error.message || error}`;
          errors.push(errorMsg);
        }
      }
      // Set import result for display
      setImportResult({
        success: successCount + updatedCount > 0,
        created: successCount,
        updated: updatedCount,
        skipped: skippedCount
      });

      // Show results
      const totalProcessed = successCount + updatedCount;
      if (totalProcessed > 0 || skippedCount > 0) {
        let description = '';
        if (totalProcessed > 0) {
          description = `Successfully processed ${totalProcessed} collection(s)`;
          if (successCount > 0) description += ` (${successCount} created)`;
          if (updatedCount > 0) description += ` (${updatedCount} updated)`;
        }
        if (skippedCount > 0) {
          if (description) description += `, `;
          description += `${skippedCount} skipped (system collections or existing)`;
        }
        if (errorCount > 0) description += `. ${errorCount} failed.`;

        toast({
          title: "Import Complete",
          description,
          variant: totalProcessed > errorCount ? "default" : "destructive",
        });
      } else if (errorCount > 0) {
        toast({
          title: "Import Failed",
          description: "No collections were processed successfully.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "No Changes",
          description: "All collections already exist and no changes were made.",
          variant: "default",
        });
      }

      if (errors.length > 0) {
        // Show detailed errors for debugging
        if (errors.length <= 3) {
          toast({
            title: "Detailed Errors",
            description: errors.join('; '),
            variant: "destructive",
          });
        }
      }
      
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import schema",
        variant: "destructive",
      });
      setImportResult({
        success: false,
        created: 0,
        updated: 0,
        skipped: 0
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleLoadLocalSchema = async () => {
    try {
      setIsImporting(true);
      setImportResult(null);
      
      const response = await fetch('/upload/data/pb_schema_latest.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load local schema: ${response.status} ${response.statusText}`);
      }
      
      const schemaText = await response.text();
      
      // Validate that it's valid JSON
      JSON.parse(schemaText);
      
      // Directly import the schema
      await handleSchemaImport(schemaText);
      
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to load and import local schema file",
        variant: "destructive",
      });
      setImportResult({
        success: false,
        created: 0,
        updated: 0,
        skipped: 0
      });
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('aboutSystem')}</h1>
      </div>
      
      <Separator />
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="overflow-hidden border border-border transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-muted/50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <ServerIcon className={`h-5 w-5 ${theme === 'dark' ? 'text-sky-400' : 'text-sky-600'}`} />
              <span className="font-thin text-xl">{t('systemDescription')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('systemVersion')}</span>
                  <span className="text-foreground font-medium">{t('version')} 1.5.1</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('license')}</span>
                  <span className="text-foreground font-medium">{t('mitLicense')}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">{t('releasedOn')}</span>
                  <span className="text-foreground font-medium">Auguest 21, 2025</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border border-border transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-muted/50 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Code2 className={`h-5 w-5 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span>{t('links')}</span>
            </CardTitle>
            <CardDescription className="font-medium text-base">{systemName || 'CheckCle'} {t('resources').toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="flex items-center justify-start gap-3 h-12 hover:bg-muted/50 transition-all duration-200" onClick={() => window.open("https://github.com/operacle/checkcle", "_blank")}>
                <Github className={`h-5 w-5 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`} />
                <span>{t('viewOnGithub')}</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-start gap-3 h-12 hover:bg-muted/50 transition-all duration-200" onClick={() => window.open("https://docs.checkcle.io", "_blank")}>
                <FileText className={`h-5 w-5 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`} />
                <span>{t('viewDocumentation')}</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-start gap-3 h-12 hover:bg-muted/50 transition-all duration-200" onClick={() => window.open("https://x.com/checkcle_oss", "_blank")}>
                <Twitter className={`h-5 w-5 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`} />
                <span>{t('followOnX')}</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-start gap-3 h-12 hover:bg-muted/50 transition-all duration-200" onClick={() => window.open("https://discord.gg/xs9gbubGwX", "_blank")}>
                <MessageCircle className={`h-5 w-5 ${theme === 'dark' ? 'text-white/80' : 'text-gray-700'}`} />
                <span>{t('joinDiscord')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card className="overflow-hidden border border-border transition-all duration-300 hover:shadow-md">
        <CardHeader className="bg-muted/50 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Database className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <span>{t('updateSchema')}</span>
          </CardTitle>
          <CardDescription className="font-medium text-base">{t('updateSchemaDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="merge-fields"
                checked={mergeFields}
                onCheckedChange={(checked) => setMergeFields(checked === true)}
              />
              <Label htmlFor="merge-fields" className="text-sm font-medium">
	              {t('mergeFieldsLabel')}
              </Label>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleLoadLocalSchema}
              disabled={isImporting}
              className={`flex items-center gap-2 transition-all duration-200 ${
                isImporting ? 'animate-pulse' : ''
              }`}
            >
              <Database className={`h-4 w-4 ${isImporting ? 'animate-spin' : ''}`} />
              {isImporting ? t('importing') : t('clickToUpdateSchema')}
            </Button>
          </div>

          {importResult && (
            <div className={`mt-4 p-4 rounded-lg border ${
              importResult.success 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            } animate-in fade-in-0 slide-in-from-bottom-2 duration-300`}>
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-5 w-5 ${
                  importResult.success 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`} />
                <span className={`font-medium ${
                  importResult.success 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {importResult.success ? t('importSuccessful') : t('importFailed')}
                </span>
              </div>
              <div className={`mt-2 text-sm ${
                importResult.success 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {importResult.created > 0 && `${importResult.created} collections created`}
                {importResult.updated > 0 && (importResult.created > 0 ? ', ' : '') + `${importResult.updated} collections updated`}
                {importResult.skipped > 0 && ((importResult.created > 0 || importResult.updated > 0) ? ', ' : '') + `${importResult.skipped} collections skipped`}
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>{t('instructions')}:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>{t('mergeFields')}:</strong> {t('instructionsMergeFields')}</li>
              <li>{t('instructionsCollections')}</li>
              <li>{t('instructionsImportAuth')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSystem;