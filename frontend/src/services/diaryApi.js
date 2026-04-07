const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/diary`;

const fetchDiaries = async (token) => {
	const res = await fetch(`${API_BASE_URL}/entries`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!res.ok) {
		throw new Error('Failed to fetch diary entries');
	}

	return res.json();
};

const createDiary = async (token, diaryData) => {
	const res = await fetch(`${API_BASE_URL}/entries`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(diaryData),
	});

	if (!res.ok) {
		throw new Error('Failed to save diary entry');
	}

	return res.json();
};

export { fetchDiaries, createDiary };