from pydantic import BaseModel


class RoleListItem(BaseModel):
    roleId: int
    roleName: str
    roleCode: str
    description: str = ""
    enabled: bool = True
    createTime: str = ""


class RoleCreate(BaseModel):
    roleName: str
    roleCode: str
    description: str = ""
    enabled: bool = True


class RoleUpdate(BaseModel):
    roleName: str | None = None
    roleCode: str | None = None
    description: str | None = None
    enabled: bool | None = None
