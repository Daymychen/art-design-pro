from sqlalchemy.orm import Session
from app.models.role import Role


def get_role_list(db: Session, current: int = 1, size: int = 10, **filters) -> dict:
    current = max(1, current)
    size = max(1, min(size, 100))
    query = db.query(Role)
    if filters.get("roleName"):
        query = query.filter(Role.role_name.like(f"%{filters['roleName']}%"))
    if filters.get("roleCode"):
        query = query.filter(Role.role_code.like(f"%{filters['roleCode']}%"))
    if filters.get("enabled") is not None:
        query = query.filter(Role.enabled == filters["enabled"])

    total = query.count()
    roles = query.order_by(Role.id).offset((current - 1) * size).limit(size).all()

    records = []
    for r in roles:
        records.append({
            "roleId": r.id,
            "roleName": r.role_name,
            "roleCode": r.role_code,
            "description": r.description,
            "enabled": r.enabled,
            "createTime": r.created_at.strftime("%Y-%m-%d %H:%M:%S") if r.created_at else "",
        })
    return {"records": records, "current": current, "size": size, "total": total}


def create_role(db: Session, data: dict) -> Role:
    role = Role(
        role_name=data["roleName"],
        role_code=data["roleCode"],
        description=data.get("description", ""),
        enabled=data.get("enabled", True),
    )
    db.add(role)
    db.commit()
    return role


def update_role(db: Session, role_id: int, data: dict) -> Role | None:
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        return None
    field_map = {
        "roleName": "role_name", "roleCode": "role_code",
        "description": "description", "enabled": "enabled",
    }
    for key, val in data.items():
        if val is not None and key in field_map:
            setattr(role, field_map[key], val)
    db.commit()
    return role


def delete_role(db: Session, role_id: int) -> bool:
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        return False
    db.delete(role)
    db.commit()
    return True
