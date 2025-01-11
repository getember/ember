cd ./dev/tool
rushx run-local create-workspace ws1 -w DevWorkspace # Create workspace
rushx run-local create-account user1 -p 1234 -f John -l Appleseed # Create account
rushx run-local configure ws1 --list --enable '*' # Enable all modules
rushx run-local assign-workspace user1 ws1 # Assign workspace to user
rushx run-local confirm-email user1 # To allow the creation of additional test workspaces

#rushx run-local create-workspace ws1 -w DevWorkspace # Create workspace
#rushx run-local create-account user4 -p 1234 -f John -l Appleseed # Create account
#rushx run-local configure ws1 --list --enable '*' # Enable all modules
#rushx run-local assign-workspace user4 ws1 # Assign workspace to user
#rushx run-local confirm-email user4 # To allow the creation of additional test workspaces

#rushx run-local create-workspace ws2 -w TestWorkspace # Create workspace
#rushx run-local create-account user2 -p 12345 -f John -l Appleseed # Create account
#rushx run-local configure ws2 --list --enable '*' # Enable all modules
#rushx run-local assign-workspace user2 ws2 # Assign workspace to user
#rushx run-local confirm-email user2 # To allow the creation of additional test workspaces