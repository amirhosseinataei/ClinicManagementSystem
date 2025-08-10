  // Reset modal to add mode when closed
  const clinicModal = document.getElementById('addClinicModal');
  clinicModal.addEventListener('hidden.bs.modal', function () {
    const form = document.getElementById('clinicForm');
    form.reset();
    document.getElementById('addClinicModalLabel').textContent = 'افزودن درمانگاه جدید';
    document.getElementById('submitBtn').textContent = 'ثبت درمانگاه';
    form.querySelector('input[name="clinic_id"]').value = '';
  });

  // Handle form submission for both add and edit
  document.getElementById('clinicForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const clinicId = formData.get('clinic_id');
    const isEditMode = !!clinicId;

    const payload = {
      name: formData.get('name'),
      address: formData.get('address'),
      license_number: formData.get('license_number'),
      supervisor: {
        name: formData.get('supervisor_name'),
        phone: formData.get('supervisor_phone'),
        national_code: formData.get('supervisor_national_code')
      }
    };

    try {
      const url = isEditMode ? `/overseer/clinics/${clinicId}` : '/overseer/clinics';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        alert('خطا: ' + (err.message || (isEditMode ? 'ویرایش درمانگاه انجام نشد' : 'ثبت درمانگاه انجام نشد')));
        return;
      }

      alert(isEditMode ? 'درمانگاه با موفقیت ویرایش شد' : 'درمانگاه با موفقیت ثبت شد');
      bootstrap.Modal.getInstance(clinicModal).hide();
      location.reload();
    } catch (err) {
      alert('خطای شبکه یا سرور');
      console.error(err);
    }
  });

  // Handle edit button click
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', async function () {
      const row = this.closest('tr');
      const clinicId = row.dataset.id;

      // Fetch clinic data
      try {
        const res = await fetch(`/overseer/clinics/${clinicId}`);
        if (!res.ok) {
          alert('خطا در دریافت اطلاعات درمانگاه');
          return;
        }
        const clinic = await res.json();
        console.log(clinic);
        
        // Populate form
        const form = document.getElementById('clinicForm');
        form.querySelector('input[name="clinic_id"]').value = clinic._id;
        form.querySelector('input[name="name"]').value = clinic.name;
        form.querySelector('input[name="license_number"]').value = clinic.license_number;
        form.querySelector('textarea[name="address"]').value = clinic.address;
        form.querySelector('input[name="supervisor_name"]').value = clinic.supervisor_id?.name || '';
        form.querySelector('input[name="supervisor_national_code"]').value = clinic.supervisor_id?.national_code || '';
        form.querySelector('input[name="supervisor_phone"]').value = clinic.supervisor_id?.phone || '';

        // Update modal title and button for edit mode
        document.getElementById('addClinicModalLabel').textContent = 'ویرایش درمانگاه';
        document.getElementById('submitBtn').textContent = 'ذخیره تغییرات';
      } catch (err) {
        console.error(err);
        alert('خطای سرور در دریافت اطلاعات');
      }
    });
  });

  // Handle toggle status
  document.querySelectorAll('.toggle-status-btn').forEach(button => {
    button.addEventListener('click', async function () {
      const row = this.closest('tr');
      const clinicId = row.dataset.id;
      const activate = this.classList.contains('btn-success');

      try {
        const res = await fetch(`/overseer/clinics/${clinicId}/status`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ is_active: activate })
        });

        if (res.ok) {
          alert(`درمانگاه با موفقیت ${activate ? 'فعال' : 'غیرفعال'} شد`);
          location.reload();
        } else {
          alert('خطا در تغییر وضعیت');
        }
      } catch (err) {
        console.error(err);
        alert('خطای سرور');
      }
    });
  });