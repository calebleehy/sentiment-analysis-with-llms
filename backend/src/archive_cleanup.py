from backend_utils import (BACKEND_ROOT, get_datapath)
import os, datetime
"""
implements some 
"""
ARCHIVE_PATH = os.path.join(BACKEND_ROOT, ".\\archived_data")
def create_timestamped_directory(directory_path):
    """
    Creates a new directory within the specified directory with the current timestamp.

    Args:
    directory_path: The path to the directory where the new directory should be created.

    Returns:
    The path to the newly created directory.
    """

    # Get the current timestamp in the format YYYY-MM-DD_HH-MM-SS
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    # Create the new directory path by joining the directory path and the timestamp
    new_directory_path = os.path.join(directory_path, timestamp)

    # Create the new directory
    os.mkdir(new_directory_path)

    # Return the path to the new directory
    return new_directory_path

def main():
    create_timestamped_directory(ARCHIVE_PATH)

if __name__=="__main__": 
    main() 