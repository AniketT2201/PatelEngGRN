interface IFolder {
    Id: number;
    Name: string;
    Files:any;
    Folders: IFolder[];
  }