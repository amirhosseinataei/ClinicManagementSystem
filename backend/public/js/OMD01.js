	const manualDrugModal = document.getElementById('manualDrugModal');
	manualDrugModal.addEventListener('hidden.bs.modal', function () {
		const form = document.getElementById('drugForm');
		form.reset();
		document.getElementById('manualDrugModalLabel').textContent = 'افزودن/ویرایش دارو';
		document.getElementById('submitDrugBtn').textContent = 'ثبت دارو';
		form.querySelector('input[name="drug_id"]').value = '';
	});

	document.getElementById('drugForm').addEventListener('submit', async function (e) {
		e.preventDefault();

		const form = e.target;
		const formData = new FormData(form);
		const drugId = formData.get('drug_id');
		const isEditMode = !!drugId;

		const payload = {
			name: formData.get('name'),
			code: formData.get('code'),
			max_dosage: formData.get('max_dosage'),
			side_effects: formData.get('side_effects'),
			benefits: formData.get('benefits'),
			usage: formData.get('usage'),
			allergy: formData.get('allergy'),
			interactions: formData.get('interactions'),
			description: formData.get('description'),
			prescription_required: formData.get('prescription_required') === 'true',
			type: formData.get('type'),
		};

		try {
			const url = isEditMode ? '/overseer/drugs/' + drugId : '/overseer/drugs';
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
				alert('خطا: ' + (err.message || (isEditMode ? 'ویرایش دارو انجام نشد' : 'ثبت دارو انجام نشد')));
				return;
			}

			alert(isEditMode ? 'دارو با موفقیت ویرایش شد' : 'دارو با موفقیت ثبت شد');
			bootstrap.Modal.getInstance(manualDrugModal).hide();
			location.reload();
		} catch (err) {
			alert('خطای شبکه یا سرور');
			console.error(err);
		}
	});

	document.querySelectorAll('.edit-btn').forEach(button => {
		button.addEventListener('click', async function () {
			const row = this.closest('tr');
			const drugId = row.dataset.id;

			try {
				const res = await fetch('/overseer/drugs/' + drugId);
				if (!res.ok) {
					alert('خطا در دریافت اطلاعات دارو');
					return;
				}
				const drug = await res.json();

				const form = document.getElementById('drugForm');
				form.querySelector('input[name="drug_id"]').value = drug._id;
				form.querySelector('input[name="name"]').value = drug.name || '';
				form.querySelector('input[name="code"]').value = drug.code || '';
				form.querySelector('input[name="max_dosage"]').value = drug.max_dosage || '';
				form.querySelector('textarea[name="side_effects"]').value = drug.side_effects || '';
				form.querySelector('textarea[name="benefits"]').value = drug.benefits || '';
				form.querySelector('textarea[name="usage"]').value = drug.usage || '';
				form.querySelector('textarea[name="allergy"]').value = drug.allergy || '';
				form.querySelector('textarea[name="interactions"]').value = drug.interactions || '';
				form.querySelector('textarea[name="description"]').value = drug.description || '';
				form.querySelector('select[name="prescription_required"]').value = drug.prescription_required.toString();
				form.querySelector('select[name="type"]').value = drug.type || '';

				document.getElementById('manualDrugModalLabel').textContent = 'ویرایش دارو';
				document.getElementById('submitDrugBtn').textContent = 'ذخیره تغییرات';
			} catch (err) {
				console.error(err);
				alert('خطای سرور در دریافت اطلاعات');
			}
		});
	});

	document.querySelectorAll('.toggle-status-btn').forEach(button => {
		button.addEventListener('click', async function () {
			const row = this.closest('tr');
			const drugId = row.dataset.id;
			const activate = this.classList.contains('btn-success');

			try {
				const res = await fetch('/overseer/drugs/' + drugId + '/status', {
					method: 'PATCH',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({ status: activate ? 'active' : 'inactive' })
				});

				if (res.ok) {
					alert(`دارو با موفقیت ${activate ? 'فعال' : 'غیرفعال'} شد`);
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

	document.getElementById('excelForm').addEventListener('submit', async function (e) {
		e.preventDefault();
	  
		const form = e.target;
		const formData = new FormData(form);
	  
		// نمایش لودر
		const loader = document.getElementById('loader');
		loader.style.display = 'flex';
	  
		try {
		  const res = await fetch('/overseer/drugs/upload', {
			method: 'POST',
			body: formData,
		  });
	  
		  const result = await res.json(); // همیشه پاسخ رو به JSON تبدیل کن
		  if (!res.ok) {
			alert('خطا: ' + (result.message || 'آپلود فایل انجام نشد'));
			return;
		  }
	  
		  alert(result.message || 'فایل با موفقیت آپلود شد');
		  const modal = bootstrap.Modal.getInstance(document.getElementById('uploadExcelModal'));
		  if (modal) modal.hide(); // فقط اگه مودال وجود داره مخفی کن
		  location.reload();
		} catch (err) {
		  alert('خطای شبکه یا سرور');
		  console.error('Error uploading file:', err);
		} finally {
		  // پنهان کردن لودر در هر حالت (موفقیت یا خطا)
		  loader.style.display = 'none';
		}
	  });
