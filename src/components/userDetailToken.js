const addUserDetail = (response) => {
  console.log(response);
  localStorage.setItem("isAuthenticate", response.data.success);
  localStorage.setItem("id", response.data.user.ID);
  localStorage.setItem("name", response.data.user.name);
  localStorage.setItem("email", response.data.user.email);
  localStorage.setItem("role", response.data.user.role);
  localStorage.setItem("level", response.data.user.permission);

  localStorage.setItem("remember_token", response.data.user.remember_token);
  localStorage.setItem(
    "email_verified_at",
    response.data.user.email_verified_at
  );
  localStorage.setItem("status", response.data.user.status);
};

const removeUserDetail = () => {
  localStorage.removeItem("isAuthenticate");
  localStorage.removeItem("id");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
  localStorage.removeItem("remember_token");
  localStorage.removeItem("email_verified_at");
  localStorage.removeItem("status");
};

const getUserDetail = () => {
  const userDetail = {
    isAutehnticate: localStorage.getItem("isAuthenticate"),
    id: localStorage.getItem("id"),
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
    remember_token: localStorage.getItem("remember_token"),
    email_verified_at: localStorage.getItem("email_verified_at"),
    status: localStorage.getItem("status"),
  };

  return userDetail;
};

export { addUserDetail, removeUserDetail, getUserDetail };
