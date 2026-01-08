
======================================
to build and run
From app-demo directory (your preferred way): 
======================================
cd packages\app-demo 

npm run build    # Automatically builds lib-logger first! 

npm start 


======================================
to build and run
# from workspace root: 
======================================

cd Ex00002v5\Ex00002v5.1Workspace 

npm run build    # Builds both in order 

npm start        # Runs the app 

The prebuild hook ensures lib-logger is always built before app-demo, regardless of where you run the command. 




========================================
Hwo it works
=================================

1. From app-demo directory (what you wanted): 

When you run npm run build from the app-demo package, it will: 

Automatically run prebuild first, which builds lib-logger 

Then run build to compile app-demo 

The prebuild script in app-demo/package.json ensures the dependency is built first. 

2. From workspace root (bonus): 

You can also run from the root: 

npm run build    # Builds lib-logger, then app-demo 

npm start        # Runs the app 

How it works: 

prebuild hook: npm automatically runs any script named prebuild before build. So when you run npm run build in app-demo, it: 

First runs prebuild → builds lib-logger 

Then runs build → builds app-demo 

Root-level scripts: For convenience, you can build everything from the root with the correct order. 