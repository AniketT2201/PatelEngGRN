import { ISafetyPortalProps } from "../../services/interface/ISafetyPortalProps";
import SPCRUDOPS from '../dal/spcrudops';
import {IHr  } from '../interface/IHr';


interface IFolder {
    Id: number;
    Name: string;
    Files: IHr[];
    Folders: IFolder[];
  }
  export interface IHrOps {
      getHrData(props: ISafetyPortalProps): Promise<IFolder[]>;
  }
  
  export default function HrOps() {
    const spCrudOps = SPCRUDOPS();

    const getHrData = async (props: ISafetyPortalProps): Promise<IFolder[]> => {
        try {
            const spCrudOpsInstance = await spCrudOps;

            // Fetch both files and folders from the "HR" library
            const results = await spCrudOpsInstance.getData(
                "HR", 
                "*,File/Name,EncodedAbsUrl,Modified,FileLeafRef,FSObjType,Folder/Name",  // Query for folder name
                "File",
                "Status eq 'Active'", 
                { column: 'ID', isAscending: false }, 
                props
            );

            console.log('Results from API HR:', results);

            const foldersMap: { [key: string]: IFolder } = {};
            const files: IHr[] = [];

            results.map((item: { 
                Id: number; 
                Name: string; 
                CeoMessage: string; 
                File: unknown; 
                Status: string; 
                EncodedAbsUrl: string; 
                FileLeafRef: string; 
                FSObjType: number;
                ServerRedirectedEmbedUrl:any;
                ParentFolder?: { Id: number, Name: string }; 
                Folder?: { Name: string };  // Folder name field
            }) => {
                if (item.FSObjType === 1) {  // If it's a folder
                    const folderName = item.Folder ? item.Folder.Name : item.Name;
                    if (!foldersMap[item.Id]) {
                        foldersMap[item.Id] = {
                            Id: item.Id,
                            Name: folderName,  // Folder name
                            Files: [],
                            Folders: []
                        };
                    }

                    // Add the folder to its parent folder, if necessary
                    if (item.ParentFolder) {
                        if (!foldersMap[item.ParentFolder.Id]) {
                            foldersMap[item.ParentFolder.Id] = {
                                Id: item.ParentFolder.Id,
                                Name: item.ParentFolder.Name,
                                Files: [],
                                Folders: []
                            };
                        }
                        foldersMap[item.ParentFolder.Id].Folders.push(foldersMap[item.Id]);  // Nest the folder
                    }
                } else {  // If it's a file
                    files.push({
                        Id: item.Id,
                        Name: item.Name,
                        File: item.File,
                        Status: item.Status,
                        FileUrl: item.EncodedAbsUrl,
                        CeoMessage: item.CeoMessage,
                        ServerRedirectedEmbedUrl:item.ServerRedirectedEmbedUrl
                    });
                }
            });

            // Assemble root folders and attach files at the root level
            const rootFolders: IFolder[] = Object.keys(foldersMap).map(key => foldersMap[key as keyof typeof foldersMap])
                .filter(folder => !folder.Folders.some(f => f.Id === folder.Id));

            // Attach files to the root folder
            rootFolders.push({
                Id: 0,
                Name: 'Root',
                Files: files,
                Folders: rootFolders
            });

            console.log('Processed Folders and Files:', rootFolders);
            return rootFolders;
        } catch (error) {
            console.error('Error in getHrData:', error.message);
            throw error;
        }
    };

    return {
        getHrData
    };
}
