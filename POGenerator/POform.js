/**
* @author Swastik Nayak <swastiknayak2016@gmail.com>
*/
/**
 * This js file do all the operations related item table modification and collect form data on submit button click and redirect to viewPO.html
 */



function calculateTotalValue(element) {
    // Get the row that contains the element
    var row = element.closest('tr');
    
    // Get the values of Quantity and Unit Price fields
    var quantity = row.querySelector('input[name^="quantity"]').value;
    var price = row.querySelector('input[name^="price"]').value;
    
    // Validate inputs (ensure quantity and price are numbers)
    if (!isNaN(quantity) && !isNaN(price) && quantity > 0 && price > 0) {
        var totalValue = parseFloat(quantity) * parseFloat(price);
        
        // Set the calculated total value into the corresponding Total Value field
        row.querySelector('input[name^="total"]').value = totalValue.toFixed(2);
    } else {
        // If either quantity or price is invalid, clear the Total Value
        row.querySelector('input[name^="total"]').value = '';
        
    }
    updateTotalBasePrice();                                     //called here
}
//                                                                          total base price
function updateTotalBasePrice() {
    // Get all the Total Value fields
    var totalFields = document.querySelectorAll('input[name^="total"]');
    var totalBasePrice = 0;

    // Sum up the values from all Total Value fields
    totalFields.forEach(function(field) {
        var value = parseFloat(field.value);
        if (!isNaN(value)) {
            totalBasePrice += value;
        }
    });

    // Update the Total Base Price field
    document.getElementById('total-base-price').value = totalBasePrice.toFixed(2);

    // After updating the base price, update IGST and final total
    updateIGSTAndFinalTotal(totalBasePrice);                                            //called gst adder
}


//gst adder 
function updateIGSTAndFinalTotal(basePrice) {
    // Calculate IGST @ 18%
    var igst = basePrice * 0.18;

    // Update IGST field
    document.getElementById('igst').value = igst.toFixed(2);

    // Calculate the Final Total (Base Price + IGST)
    var finalTotal = basePrice + igst;

    // Update the Final Total field
    document.getElementById('final-total').value = finalTotal.toFixed(2);

    // Recalculate after round off is applied
    calculateFinalTotal();                              //call final
}

//---------------------------------------------------------------------- final handled 
function calculateFinalTotal() {
    // Get the round off value
    var roundOff = parseFloat(document.getElementById('round-off').value) || 0;

    // Get the current final total value
    var finalTotal = parseFloat(document.getElementById('final-total').value) || 0;

    // Apply round off
    finalTotal += roundOff;

    // Update the Final Total with round off
    document.getElementById('final-total').value = finalTotal.toFixed(2);
}



let itemCount = 1; // Start counting rows from 1

        // Function to add a new item row
        function addItemRow() {
            itemCount++;
            const table = document.getElementById('items-table').getElementsByTagName('tbody')[0];
            const row = table.insertRow();
            row.innerHTML = `
                <td>${itemCount}</td>
                <td><input type="text" name="item-${itemCount}" placeholder="Item Name" required></td>
                <td><input type="text" name="make-${itemCount}" placeholder="Make" required></td>
                <td><input type="text" name="model-${itemCount}" placeholder="Model" required></td>
                <td><input type="number" name="quantity-${itemCount}" placeholder="Qty" min="1"   oninput="calculateTotalValue(this)" required></td>
                <td><input type="text" name="uom-${itemCount}" placeholder="UOM" required></td>
                <td><input type="number" name="price-${itemCount}" placeholder="Price"  oninput="calculateTotalValue(this)" required></td>
                <td><input type="text" name="total-${itemCount}" placeholder="Total" readonly></td>
                <td><button type="button" onclick="removeItemRow(this)" class="btn-remove">Remove</button></td>
            `;
        }

        // Function to remove an item row
        function removeItemRow(button) {
            const row = button.closest('tr');
            row.remove();
            itemCount--;
            updateRowNumbers(); // Adjust row numbering
            updateTotalBasePrice(); 
        }

        // Function to update row numbers after removal
        function updateRowNumbers() {
            const rows = document.querySelectorAll('#items-table tbody tr');
            rows.forEach((row, index) => {
                row.cells[0].textContent = index + 1; // Update the first cell with row number
                row.querySelector('[name^="item-"]').name = `item-${index + 1}`;
                row.querySelector('[name^="make-"]').name = `make-${index + 1}`;
                row.querySelector('[name^="model-"]').name = `model-${index + 1}`;
                row.querySelector('[name^="quantity-"]').name = `quantity-${index + 1}`;
                row.querySelector('[name^="uom-"]').name = `uom-${index + 1}`;
                row.querySelector('[name^="price-"]').name = `price-${index + 1}`;
                row.querySelector('[name^="total-"]').name = `total-${index + 1}`;
            });
        }

        // Function to submit form data to the next page
        function submitForm() {
            const formData = {
                poNumber: document.getElementById('PO-no').value,
                orderDate: document.getElementById('order-date').value,
                toAddress: document.querySelector('.To-address').value,
                // subject: document.getElementById('sub').value,
                items: []
            };

            const itemRows = document.querySelectorAll('#items-table tbody tr');
            itemRows.forEach((row, index) => {
                const itemData = {
                    item: row.querySelector('[name^="item-"]').value,
                    make: row.querySelector('[name^="make-"]').value,
                    model: row.querySelector('[name^="model-"]').value,
                    quantity: row.querySelector('[name^="quantity-"]').value,
                    uom: row.querySelector('[name^="uom-"]').value,
                    price: row.querySelector('[name^="price-"]').value,
                    total: row.querySelector('[name^="total-"]').value
                };
                formData.items.push(itemData);
            });

            // Store the form data in sessionStorage and open the next page
            sessionStorage.setItem('purchaseOrderData', JSON.stringify(formData));
            window.location.href = "viewPO.html"; // Redirect to the view page
        }