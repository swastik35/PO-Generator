/**
 @author Swastik Nayak <swastiknayak2016@gmail.com>
**/
/**
 * This js file use to show all the collected data through POform.js which need to be shown 
 */

'use strict';
window.onload = function() {
    const formData = JSON.parse(sessionStorage.getItem('purchaseOrderData'));

    if (formData) {
        // Display form details
        document.getElementById('PO-no-display').innerText = formData.poNumber;
        document.getElementById('order-date-display').innerText = formData.orderDate;
        document.getElementById('to-address-display').innerText = formData.toAddress;
        // document.getElementById('subject-display').innerText = formData.subject;

        // Render items in a table
        const itemsTable = document.getElementById('items-display');
        formData.items.forEach((item, index) => {
            const row = itemsTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.item}</td>
                <td>${item.make}</td>
                <td>${item.model}</td>
                <td>${item.quantity}</td>
                <td>${item.uom}</td>
                <td>${item.price}</td>
                <td>${item.total}</td>
            `;
        });

        // Calculate and display the grand total
        const grandTotal = formData.items.reduce((sum, item) => sum + parseFloat(item.total), 0);
        document.getElementById('grand-total-display').innerText = grandTotal.toFixed(2);
    }
}