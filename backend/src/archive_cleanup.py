from backend_utils import BACKEND_ROOT, get_datapath
import os, datetime, shutil, json

"""
1. updates ~/backend/server/data with final json files for dashboard
2. archives all generated data and clears ~/backend/data for the next run
unused functions: compare_dirs, update_server_data
- because tables_for_dashboard now overwrites ~/backend/server/data directly
Prev: tables_for_dashboard.py, Next: Done!
"""
ARCHIVE_PATH = os.path.join(BACKEND_ROOT, ".\\archived_data")
SERVER_DATA_PATH = os.path.join(BACKEND_ROOT, ".\\server\\data")

def compare_dirs(source, dest):
    """
    Compares JSON files in source and destination directories and reports which files in destination will be overwritten.

    Args:
      source: Path to the source directory containing JSON files.
      dest: Path to the destination directory containing JSON files.

    Returns:
      list: List of filenames in the destination directory that will be overwritten.
    """

    # Get lists of JSON files in both directories.
    source_files = [f for f in os.listdir(source) if f.endswith(".json")]
    dest_files = [f for f in os.listdir(dest) if f.endswith(".json")]

    # Create a set of filenames in the destination directory.
    dest_filenames = set(dest_files)

    # Initialize a list to store filenames that will be overwritten.
    overwritten_files = []

    # Iterate through JSON files in the source directory.
    for filename in source_files:
        # Check if the file exists in the destination directory.
        if filename in dest_filenames:
            # Load JSON data from both files.
            with open(os.path.join(source, filename), "r") as f:
                source_data = json.load(f)
            with open(os.path.join(dest, filename), "r") as f:
                dest_data = json.load(f)

            # Compare the JSON data.
            if source_data != dest_data:
                overwritten_files.append(filename)

    # Return the list of files that will be overwritten.
    return overwritten_files


def update_server_data(source, dest):
    """
    overwrites json in ~/backend/server/data with fresh stuff
    Copies JSON files from the source directory to the destination directory, overwriting existing files with the same name.

    Args:
      source: Path to the source directory containing JSON files.
      dest: Path to the destination directory where JSON files will be copied.
      filenames: List of filenames to copy and overwrite.
    """
    filenames = compare_dirs(source, dest)
    # Ask the user if they want to continue.
    continue_copy = input(
        "The following files in the destination directory will be overwritten:\n"
        + "\n".join(filenames)
        + "\nDo you want to continue? (y/n): "
    )

    if continue_copy == "y":
        source_json = [f for f in os.listdir(source) if f.endswith('.json')] # copies all
        for filename in source_json:
            source_path = os.path.join(source, filename)
            dest_path = os.path.join(dest, filename)
            
            with open(source_path, "r") as source_file:
                with open(dest_path, "w") as dest_file:
                    dest_file.write(source_file.read())
            print(f"Copied '{filename}' from source to destination.")
    else:
        print("Copy operation cancelled.")


def archive_clear_data(archivepath, datapath, serverdatapath):
    """
    if folder specified by datapath is not empty(apart from .gitignore), make new folder in archived_data and copy over all files in data to there. 
    then, empty ~/backend/data folder
    then, backup generated json for dashboard
    """
    now = datetime.datetime.now()
    dt_string = now.strftime("%d-%m-%Y_%H-%M-%S")
    new_folder_path = os.path.join(archivepath, dt_string)
    os.mkdir(new_folder_path)
    print(f"archiving to {new_folder_path}")
    if (
        len(os.listdir(datapath)) > 1
    ):  # if data folder is not empty, apart from .gitignore
        files = os.listdir(datapath)
        for f in files:
            if f != ".gitignore":
                shutil.copy(os.path.join(datapath, f), os.path.join(new_folder_path, f))
                print(f"copying {f}")
        for f in os.listdir(datapath):
            if f != ".gitignore":
                os.remove(os.path.join(datapath, f))
                print(f"removing {f}")

    jsonbackup = os.listdir(serverdatapath)
    jsonbackuppath = os.path.join(new_folder_path, "server_data")
    os.mkdir(jsonbackuppath)
    print(f"backing up: {jsonbackup}")
    for j in jsonbackup:
        print(f"source: {os.path.join(serverdatapath, j)}")
        shutil.copy(os.path.join(serverdatapath, j), os.path.join(jsonbackuppath, j))
    if os.listdir(jsonbackuppath) == jsonbackup:
        print("Success!")
    else:
        print(os.listdir(jsonbackuppath))


def main():
    """
    1. archive, then clear contents of ~/backend/data
    2. back up json files from this run of the pipeline
    """
    archive_clear_data(ARCHIVE_PATH, get_datapath(), SERVER_DATA_PATH)


if __name__ == "__main__":
    main()
