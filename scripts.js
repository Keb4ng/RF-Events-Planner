$(document).ready(function () {
  // 1. Quantity update and subtotal calculation
  $(".qty-btn-plus").click(function () {
    const $input = $(this).siblings(".qty-item");
    let value = parseInt($input.val()) || 0;
    $input.val(++value);
    updateSubtotal();
  });

  $(".qty-btn-minus").click(function () {
    const $input = $(this).siblings(".qty-item");
    let value = parseInt($input.val()) || 0;
    if (value > 0) {
      $input.val(--value);
      updateSubtotal();
    }
  });

  function updateSubtotal() {
    let subtotal = 0;

    $(".ticket-option").each(function () {
      const quantity = parseInt($(this).find(".qty-item").val()) || 0;
      const unitPrice =
        parseFloat($(this).find(".price-total").data("price")) || 0;
      const vat = parseFloat($(this).find(".price-total").data("vat")) || 0;
      subtotal += quantity * (unitPrice + vat);
    });

    $(".subtotal-tb input").val(`£ ${subtotal.toFixed(2)}`);
  }

  // 2. Save ticket data on Continue click
  $('.nav-btns a[href$="Nav2_Details.html"]').click(function () {
    const tickets = [];

    $(".ticket-option").each(function () {
      const title = $(this).find(".ticket-title").text().trim();
      const quantity = parseInt($(this).find(".qty-item").val()) || 0;
      const unitPrice =
        parseFloat($(this).find(".price-total").data("price")) || 0;
      const vat = parseFloat($(this).find(".price-total").data("vat")) || 0;

      if (quantity > 0) {
        tickets.push({
          title,
          quantity,
          unitPrice,
          vat,
          total: quantity * (unitPrice + vat)
        });
      }
    });

    const checkoutData = {
      tickets,
      subtotal:
        parseFloat($(".subtotal-tb input").val().replace("£", "").trim()) || 0
    };

    localStorage.setItem("checkoutInfo", JSON.stringify(checkoutData));
  });

  // 3. Render tickets and forms on next page
  if ($(".ticket-list").length && $(".billing-form").length) {
    const checkoutInfo = JSON.parse(localStorage.getItem("checkoutInfo"));

    if (checkoutInfo && checkoutInfo.tickets?.length > 0) {
      // Render ticket summary
      checkoutInfo.tickets.forEach((ticket) => {
        const ticketHTML = `
          <div class="ordered-item">
            <p class="item-title">${ticket.title}</p>
            <p class="item-sched"><i class="fa-solid fa-calendar-days"></i> Wednesday, July 30, 2025 - 11:30PM Sunday</p>
            <div class="item-qp">
              <p>Quantity: ${ticket.quantity}</p>
              <p>Price: £ ${(ticket.unitPrice * ticket.quantity).toFixed(
                2
              )} + £ ${(ticket.vat * ticket.quantity).toFixed(2)} VAT</p>
            </div>
          </div>`;
        $(".ticket-list").append(ticketHTML);

        // Grouped attendee form per ticket type
        let groupedFormHTML = `
          <div class="attendee-group">
            <h3 class="section-title alt">${ticket.title} Tickets</h3>`;
        for (let i = 1; i <= ticket.quantity; i++) {
          groupedFormHTML += `
                <div class="attendee-cont">
                  <h4>Attendee ${i}</h4>
                  <div class="attendee-form">
                    <div class="form-row">
                      <label>First Name:</label>
                      <input type="text" name="" required>
                    </div>
                    <div class="form-row">
                      <label>Last Name:</label>
                      <input type="text" name="" required>
                    </div>
                    <div class="form-row">
                      <label>Mobile:</label>
                      <input type="text" name="" required>
                    </div>
                    <div class="form-row">
                      <label>Email:</label>
                      <input type="email" name="" required>
                    </div>
                    <div class="form-row span-full">
                      <label>Dietary:</label>
                      <input type="text" name="" required>
                    </div>
                      <div class="form-row span-full">
                      <label>Specialist:</label>
                      <input type="text" name="" required>
                    </div>
                  </div>
                </div>
              `;
        }

        groupedFormHTML += `
        <div class="disclaimer-cont">
          <p>I have read, understood and agree to the Terms & Conditions.<span class="dc-req">  *</span></p>
          <span class="terms">
            By purchasing a ticket I confirm that I have read, understood, and agree to
            the Terms & Conditions as set out below.
            <br><br>
            1. Entry tickets (including but not limited to Day Passes, Weekend Passes, and Gold Passes) are strictly valid for one individual only. Each attendee must present their own valid ticket at the point of entry. Photocopies, screenshots, or unauthorized reproductions of tickets will not be accepted and may result in denial of access to the event.
            <br>    <br>
            2. All ticket purchases are final. Tickets are non-refundable, non-exchangeable, and non-transferable under any circumstances unless the event is officially canceled by the organizers. No refunds will be issued due to personal scheduling conflicts, weather conditions, travel issues, or no-shows.
            <br><br>
            3. The event organizer reserves the right to make changes to the event schedule, lineup, venue, or any part of the event at their sole discretion. This may include but is not limited to the cancellation or substitution of performers, speakers, or scheduled activities. In such cases, reasonable efforts will be made to notify attendees in advance.
            <br><br>
            4. Unauthorized resale, duplication, or any attempt to alter the ticket in any form is strictly prohibited. Any individual found engaging in fraudulent ticket activities may be refused entry or removed from the event without refund, and may be subject to legal action.
            <br><br>
            5. All attendees are responsible for their own personal safety and belongings throughout the duration of the event. The organizers and venue are not liable for any lost, stolen, or damaged personal items, or for any personal injuries, accidents, or incidents occurring during the event. Attendees are encouraged to remain aware of their surroundings and to report any suspicious behavior to event staff.
            <br><br>
            6. By attending the event, ticket holders acknowledge and consent to be photographed, filmed, or recorded for promotional, marketing, and archival purposes. These materials may be used by the organizers without compensation or further approval.
            <br><br>
            7. The organizers reserve the right to deny admission or remove any individual from the event premises whose behavior is deemed disruptive, unsafe, or in violation of these terms and conditions, without the right to a refund.
          </span>
          <label class="terms-cb"><input type=checkbox>  I Agree to the above additional terms. <span class="dc-req">  *</span><label>
        </div>
        </div>`; // close .attendee-group
        $(".billing-form").append(groupedFormHTML);
      });

      $(".subtotal-value").text(`£ ${checkoutInfo.subtotal.toFixed(2)}`);
    } else {
      $(".ticket-list").html("<p>No tickets selected.</p>");
    }
  }

  $('.approved input[type="radio"]').change(function () {
    const selected = $(this).val();
    const $group = $(this).closest(".approved");

    $group.find(".yes-btn, .no-btn").removeClass("selected");

    if (selected === "yes") {
      $group.find(".yes-btn").addClass("selected");
    } else if (selected === "no") {
      $group.find(".no-btn").addClass("selected");
    }
  });
});
