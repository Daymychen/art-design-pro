from typing import Any


def ok(data: Any = None, msg: str = "success") -> dict:
    """快捷返回成功响应"""
    return {"code": 200, "msg": msg, "data": data}


def fail(msg: str = "error", code: int = 400) -> dict:
    """快捷返回失败响应"""
    return {"code": code, "msg": msg, "data": None}
