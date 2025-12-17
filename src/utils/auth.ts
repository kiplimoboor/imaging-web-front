const REDIRECT_URI: string = import.meta.env.VITE_REDIRECT_URI;

function loginRedirect() {
	const params = new URLSearchParams({ client_id: "ad7b57d325", response_type: "code", redirect_uri: REDIRECT_URI });
	const link = "https://portal.mtrh.go.ke/api/method/frappe.integrations.oauth2.authorize?" + params;
	window.location.href = link;
	return null;
}

export { loginRedirect };
