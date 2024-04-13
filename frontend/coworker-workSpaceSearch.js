  
  
  // Function to populate the workspace HTML
  document.addEventListener("DOMContentLoaded", function() {
    var propertyIdParam = new URLSearchParams(window.location.search).get("propertyId");
    if (propertyIdParam) {
        var propertyId = parseInt(propertyIdParam);
        var property = propertyData.find(function(property) {
            return property.propertyId === propertyId;
        });
        if (property) {
            var workspaceContainer = document.getElementById("workSpaceTable");
            workspaceContainer.innerHTML = "";
  
            var associatedWorkspaces = workspaceData.filter(function(workspace) {
                return workspace.propertyId === propertyId;
            });
  
            if (associatedWorkspaces.length > 0) {
                associatedWorkspaces.forEach(function(workspace) {
                    var row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${workspace.propertyId}</td>
                        <td>${workspace.workspaceId}</td>
                        <td>${workspace.type}</td>
                        <td>${workspace.capacity}</td>
                        <td>${workspace.smoking}</td>
                        <td>${workspace.available}</td>
                        <td>${workspace.term}</td>
                        <td>${workspace.price}</td>
                        <td>${workspace.contactInfo}</td>
                        <td>${workspace.rating}</td>
                        <td><img src="${workspace.imageURL}" alt="Workspace Image"></td>
                    `;
                    workspaceContainer.appendChild(row);
                });
            } else {
                var noDataRow = document.createElement("tr");
                var noDataCell = document.createElement("td");
                noDataCell.colSpan = 10;
                noDataCell.textContent = "No workspaces available for this property";
                noDataRow.appendChild(noDataCell);
                workspaceContainer.appendChild(noDataRow);
            }
        }
    }
  });


  document.addEventListener("DOMContentLoaded", function() {
    var images = document.querySelectorAll("#workSpaceTable img");

    images.forEach(function(image) {
        image.addEventListener("click", function() {
            // Create the enlarged image container
            var enlargeContainer = document.createElement("div");
            enlargeContainer.classList.add("enlarge-image-container");

            // Create the enlarged image
            var enlargedImage = document.createElement("img");
            enlargedImage.src = this.src; // Set source to clicked image
            enlargedImage.alt = "Enlarged Image";

            // Append the enlarged image to the container
            enlargeContainer.appendChild(enlargedImage);

            // Append the container to the document body
            document.body.appendChild(enlargeContainer);

            // Add click event listener to the enlarged image container
            enlargeContainer.addEventListener("click", closeEnlargeImage);
        });
    });
});

// Function to close the enlarged image when clicking outside of it
function closeEnlargeImage(event) {
    if (event.target.classList.contains("enlarge-image-container")) {
        event.target.remove();
    }
}


// Function to sort the workspace table by a specified column
function SortTable(column) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("workspaceData");
  switching = true;

  while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < rows.length - 1; i++) {
          shouldSwitch = false;

          // Parse prices as numbers before comparing
          x = parseFloat(rows[i].getElementsByTagName("td")[getColumnIndex(column)].innerText);
          y = parseFloat(rows[i + 1].getElementsByTagName("td")[getColumnIndex(column)].innerText);

          if (x > y) {
              shouldSwitch = true;
              break;
          }
      }

      if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
      }
  }
}


// Function to get the column index based on the column name
function getColumnIndex(columnName) {
    var headers = document.getElementById("workspaceData").rows[0].cells;
    for (var i = 0; i < headers.length; i++) {
        if (headers[i].textContent.toLowerCase() === columnName.toLowerCase()) {
            return i;
        }
    }
    return -1;
}

  
  //Function to go back to Property Search Screen
  document.getElementById("backPropSearch").addEventListener("click", function() {
    window.location.href = "coworker-propertySearch.html"; 
  });
  
  //Function for Log Out Button
document.getElementById("logoutBtn").addEventListener("click", function() {
  window.location.href = "index.html"; 
});
  