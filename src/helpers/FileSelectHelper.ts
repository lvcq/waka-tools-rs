import { open } from "@tauri-apps/plugin-dialog";
import { pictureDir } from '@tauri-apps/api/path';


export interface PictureSelectOption{
    multiple?:boolean
    defaultPath?:string
}

export class FileSelectHelper {
   
    /**
     * Selects a picture file using the Tauri dialog plugin.
     * 
     * @param options - Optional parameters for the picture selection.
     * @param options.multiple - Allows multiple file selection if set to true. Defaults to false.
     * @param options.defaultPath - The default path to start the file selection from. Defaults to the user's picture directory.
     * @returns A promise that resolves to an array of file paths if files are selected, or null if no files are selected.
     */
    static async selectPicture(options?:PictureSelectOption){
        // Determine the default path, using the provided option or the user's picture directory
        const defaultPath = options?.defaultPath?? await pictureDir();
        // Open the file selection dialog with specified filters and options
        const result = await open({
            // Filter for image files with specified extensions
            filters: [
                {name: "图像", extensions: ['png','jpg','jpeg']}
            ],
            // Allow multiple file selection if specified in options
            multiple:options?.multiple ?? false,
            // Set the default path for the file selection dialog
            defaultPath
        })
        // If the result is an array, return it as is
        if(Array.isArray(result)){
            return result
        } 
        // If the result is a single string, return it as an array
        else if (typeof result === 'string'){
            return [result]
        }
        // If no files are selected, return null
        else{
            return null
        }
    }
}