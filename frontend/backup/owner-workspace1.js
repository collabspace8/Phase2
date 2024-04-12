document.addEventListener("DOMContentLoaded", async () => {
    const workspaceTableBody = document.getElementById("workspaceBody");
    const confirmationModal = document.getElementById("confirmationModal");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const cancelDeleteBtn = document.getElementById("cancelDelete");
    let workspaceIdToDelete = null;
  
    // Function to fetch workspace data from the backend API
    const fetchWorkspaceData = async () => {
      try {
        const response = await fetch("http://localhost:3000/workspace");
        if (!response.ok) {
          throw new Error("Failed to fetch workspace data");
        }
        return await response.json();
      } catch (error) {
        console.error("Error fetching workspace data:", error);
        return [];
      }
    };
  
    // Function to append data to the table
    const appendData = async () => {
      try {
        // Fetch workspace data from the backend
        const workspaceData = await fetchWorkspaceData();
  
        // Clear previous data
        workspaceTableBody.innerHTML = "";
  
        // Append data to the table
        workspaceData.forEach((workspace) => {
          appendRow(workspace);
        });
      } catch (error) {
        console.error("Error appending data:", error);
      }
    };
  
    // Function to append a single row to the table
    const appendRow = (workspace) => {
      const newRow = document.createElement("tr");
  
      newRow.innerHTML = `
        <td>${workspace.type}</td>
        <td>${workspace.capacity}</td>
        <td>${workspace.smoking}</td>
        <td>${workspace.available}</td>
        <td>${workspace.term}</td>
        <td>${workspace.price}</td>
        <td>
          <button class="editworkspaceBtn" data-workspace-id="${workspace._id}">Edit</button>
          <button class="deleteBtn" data-workspace-id="${workspace._id}">Delete</button>
        </td>
      `;
      workspaceTableBody.appendChild(newRow);
  
      // Attach click event handlers for buttons
      const editButton = newRow.querySelector(".editworkspaceBtn");
      editButton.addEventListener("click", () => {
        const workspaceId = editButton.getAttribute("data-workspace-id");
        window.location.href = `edit-workspace.html?workspaceId=${workspaceId}`;
      });
  
      const deleteButton = newRow.querySelector(".deleteBtn");
      deleteButton.addEventListener("click", () => {
        workspaceIdToDelete = workspace._id;
        confirmationModal.style.display = "block";
      });
    };
  
// Event listener for the confirm delete button
// Event listener for the confirm delete button
confirmDeleteBtn.addEventListener("click", async () => {
    if (workspaceIdToDelete) {
      try {
        // Send a DELETE request to the backend API to delete the workspace
        const response = await fetch(`http://localhost:3000/workspace/${workspaceIdToDelete}`, {
          method: "DELETE",
        });
  
        // Check if the deletion was successful
        if (response.ok) {
          // Remove the row from the table
          document.querySelector(`[data-workspace-id="${workspaceIdToDelete}"]`).parentNode.remove();
          console.log("Workspace deleted successfully");
        } else {
          console.error("Failed to delete workspace:", response.statusText);
        }
      } catch (error) {
        console.error("Error deleting workspace:", error);
      } finally {
        confirmationModal.style.display = "none";
        workspaceIdToDelete = null;
      }
    }
  });
  
  
  
    // Event listener for the cancel delete button
    cancelDeleteBtn.addEventListener("click", () => {
      confirmationModal.style.display = "none";
      workspaceIdToDelete = null;
    });
  
    // Initial data append
    await appendData();
  });
  