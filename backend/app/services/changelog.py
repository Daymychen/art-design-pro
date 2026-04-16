from sqlalchemy.orm import Session
from app.models.changelog import Changelog


def get_changelog_list(db: Session) -> list[dict]:
    logs = db.query(Changelog).order_by(Changelog.id.desc()).all()
    result = []
    for log in logs:
        item = {
            "version": log.version,
            "title": log.title,
            "date": log.date,
        }
        if log.detail:
            item["detail"] = log.detail
        if log.require_re_login == "true":
            item["requireReLogin"] = True
        if log.remark:
            item["remark"] = log.remark
        result.append(item)
    return result
