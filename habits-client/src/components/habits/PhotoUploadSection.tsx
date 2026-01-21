import type { ChangeEvent, RefObject } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import type { UseFormReturn } from 'react-hook-form'
import type { HabitsFormData } from '@/schemas/habits.schema'

interface PhotoUploadSectionProps {
  form: UseFormReturn<HabitsFormData>
  files: Array<File>
  fileInputRef: RefObject<HTMLInputElement | null>
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: (index: number) => void
  onButtonClick: () => void
}

export function PhotoUploadSection({
  form,
  files,
  fileInputRef,
  onFileChange,
  onRemoveFile,
  onButtonClick,
}: PhotoUploadSectionProps) {
  return (
    <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Upload className="h-5 w-5" />
        Photos
        <span className="text-sm font-normal text-zinc-400 ml-auto">
          {files.length} selected
        </span>
      </h2>

      <FormField
        control={form.control}
        name="photos"
        render={() => (
          <FormItem>
            <FormControl>
              <>
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={onFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-dashed border-2 border-zinc-600 hover:border-cyan-500/50 hover:bg-cyan-500/10 w-full bg-transparent text-white h-16 text-base hover:text-white"
                  onClick={onButtonClick}
                >
                  <Upload className="mr-3 h-5 w-5" />
                  Click to upload photos (optional)
                </Button>
              </>
            </FormControl>

            {files.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-zinc-400 mb-3">Selected files:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="relative group rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700"
                    >
                      <div className="aspect-square w-full flex items-center justify-center">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <div className="text-sm truncate font-medium">
                              {file.name}
                            </div>
                            <div className="text-xs text-zinc-400">
                              {(file.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700"
                        onClick={() => onRemoveFile(index)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>

                      <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
                        <p className="text-xs truncate font-medium">
                          {file.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
