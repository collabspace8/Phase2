// Function to handle edit workspace action
const handleEditWorkspace = (workspaceId) => {
    if (workspaceId) {
      // Redirect to the edit page with the workspace ID
      window.location.href = `edit-workspace.html?workspaceId=${workspaceId}`;  
  
      console.error('WorkspaceId is undefined');
    }
  };
  
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
  
    // Add event listeners for edit and delete buttons
    newRow.querySelector('.editWorkspaceBtn').addEventListener('click', () => handleEditWorkspace(newWorkspace.workspaceId));
    newRow.querySelector('.deleteWorkspaceBtn').addEventListener('click', () => handleDeleteWorkspace(newWorkspace.workspaceId));
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
  
  // When the page loads, fetch and append workspaces for the property
  document.addEventListener("DOMContentLoaded", async () => {
    await appendWorkspacesForProperty();
  
    const workspaceForm = document.getElementById("workspaceForm");
  
    // Handle form submission for adding a workspace
    workspaceForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const propertyId = getPropertyIdFromUrl();
      if (!propertyId) {
        console.error('PropertyId not found in URL query parameters');
        return;
      }
  
      const type = document.getElementById("type").value;
      const capacity = document.getElementById("capacity").value;
      const smoking = document.getElementById("smoking").value;
      const available = document.getElementById("available").value;
      const term = document.getElementById("term").value;
      const price = document.getElementById("price").value;
  
      // Construct a new workspace object
      const newWorkspace = {
        propertyId: propertyId,
        type: type,
        capacity: capacity,
        smoking: smoking,
        available: available,
        term: term,
        price: price,
      };
  
      try {
        // Send a POST request to add the workspace
        const response = await fetch('/add-workspace', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newWorkspace)
        });
  
        if (response.ok) {
          // Retrieve inserted workspace data from the response
          const insertedWorkspace = await response.json();
  
          // Append the new workspace to the table
          appendData(propertyId, insertedWorkspace);
  
          // Clear form fields
          workspaceForm.reset();
        } else {
          console.error('Failed to add workspace:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding workspace:', error);
      }
    });
  
    // Call displayDeleteModal function when delete button is clicked
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('deleteWorkspaceBtn')) {
        const workspaceId = event.target.closest('tr').getAttribute('data-workspace-id');
        handleDeleteWorkspace(workspaceId);
      }
    });
  
    // Call handleEditWorkspace function when edit button is clicked
    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('editWorkspaceBtn')) {
        const workspaceId = event.target.closest('tr').getAttribute('data-workspace-id');
        handleEditWorkspace(workspaceId);
      }
    });
  });
  