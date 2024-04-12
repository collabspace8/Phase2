// Function to handle edit workspace action
const handleEditWorkspace = (workspaceId) => {
  if (workspaceId) {
    // Redirect to the edit page with the workspace ID
    window.location.href = `edit-workspace.html?workspaceId=${workspaceId}`;  

    console.error('WorkspaceId is undefined');
  }
};

// When the page loads, fetch and append workspaces for the property
document.addEventListener("DOMContentLoaded", async () => {
  await appendWorkspacesForProperty();

  // Add event listener for edit button click
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('editWorkspaceBtn')) {
      const workspaceId = event.target.closest('tr').getAttribute('data-workspace-id');
      handleEditWorkspace(workspaceId);
    }
  });
});

// Function to fetch workspaces for a property
const fetchWorkspaces = async (propertyId) => {
  try {
    const response = await fetch(`/properties/${propertyId}/workspaces`);
    if (!response.ok) {
      throw new Error("Failed to fetch workspaces");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    // Handle error
  }
};

// Function to append new data to the existing table
const appendData = (propertyId, newWorkspace) => {
  const workspaceTableBody = document.getElementById("workspaceBody");

  const newRow = document.createElement("tr");
  newRow.setAttribute("data-property-id", propertyId);
  newRow.setAttribute("data-workspace-id", newWorkspace.workspaceId);

  // Populate the new row with data from the newWorkspace object
  newRow.innerHTML = `
    <td>${newWorkspace.type}</td>
    <td>${newWorkspace.capacity}</td>
    <td>${newWorkspace.smoking}</td>
    <td>${newWorkspace.available}</td>
    <td>${newWorkspace.term}</td>
    <td>${newWorkspace.price}</td>
    <td>
      <button class="editWorkspaceBtn">Edit</button>
      <button class="deleteWorkspaceBtn">Delete</button>
    </td>
  `;
  workspaceTableBody.appendChild(newRow);
};

// Function to extract propertyId from URL query parameters
const getPropertyIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const propertyId = urlParams.get('propertyId');
  if (!propertyId) {
    console.error('PropertyId not found in URL query parameters');
  }
  return propertyId;
};

// Use this function to fetch workspaces for a specific property and append them to the table
const appendWorkspacesForProperty = async () => {
  const propertyId = getPropertyIdFromUrl();
  if (!propertyId) {
    console.error('PropertyId not found in URL query parameters');
    return;
  }

  try {
    const workspaces = await fetchWorkspaces(propertyId);
    workspaces.forEach((workspace) => {
      appendData(propertyId, workspace);
    });
  } catch (error) {
    console.error('Error fetching workspaces:', error);
  }
};

// Function to handle delete workspace action
const handleDeleteWorkspace = async (workspaceId) => {
  // Display the delete confirmation modal
  displayDeleteModal(workspaceId);
};

// Function to display delete confirmation modal
const displayDeleteModal = (workspaceId) => {
  const deleteModal = document.getElementById('confirmationModal');
  deleteModal.style.display = 'block';

  // Add event listeners for confirm and cancel buttons
  const confirmButton = document.getElementById('confirmDelete');
  const cancelButton = document.getElementById('cancelDelete');

  // Confirm deletion
  confirmButton.addEventListener('click', async () => {
    try {
      const response = await fetch(`/workspaces/${workspaceId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Remove workspace row from the table
        const workspaceRow = document.querySelector(`[data-workspace-id="${workspaceId}"]`);
        workspaceRow.remove();
      } else {
        console.error('Failed to delete workspace:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting workspace:', error);
    } finally {
      // Close the delete modal
      deleteModal.style.display = 'none';
    }
  });

  

  // Cancel deletion
  cancelButton.addEventListener('click', () => {
    // Close the delete modal
    deleteModal.style.display = 'none';
  });
};

