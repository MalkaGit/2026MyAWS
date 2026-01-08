Short

it is recommanded to import by folder name,
and not by file name

index.ts defies which moduels on the directory 
can be imported using the folder name
(like c# public classes in the dll)

one can still import modules that are not in index.ts 
by importing by file name
(not recommanded
 like c# frient that allows us to import what was internal to the dll)



Details 

in c# we can  expose only some classes via namespace 
Other files are internal 


Logger3 is a FOLDER MODULE 
since the folder has index.ts
and the fodler exprots it

-As folder module 
 logger3 class can be imported by the folder name
 instead by the file name
 *    more robust as we change file name
 *    encpsulates what seen when folder imported
 Note: any file module (file with exprot)
      in tht folder that is not exported by index.ts
       can not be imported by the folder name

-logger3 class is exported =>
 it can be imported via file name 
 that is not recommanded, since file name may change