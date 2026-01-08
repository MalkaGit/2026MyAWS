Logger1 is a FILE MODULE.
The file is "file module" since it has export


- c# private 
  anything we define in file without export
  is not visible outside the file 

- c# public (file module)
  The file export the class
  That makes it "file module" (single file = single module)
  That means it can be imported by file name 
  note: importing by file name is not recommanded 
        (breaks as we change file mane)
    
- Due to export in the file,
  the file can be imported by the file path from app-demo
    import { Logger1 } from "../../lib-logger/dist/logger1";
    import { Logger2 } from "../../lib-logger/dist/logger2/logger2";

  the file can be impoted by file path from the lib itself

 
c# public (folder module)
- if the folde that holds the file has index.ts
  the module can be exported in that index.ts 
  and then we can import the module by folde rname

c# module (package module)
  if the package that holds the file has index.ts next to package.ts 
  the module can be exported in that index.ts
  and the we can impor the module by package name

