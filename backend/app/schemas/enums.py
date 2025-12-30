from enum import Enum

class ChartType(str, Enum):
    BAR = "bar"
    PIE = "pie"
    DOUGHNUT = "doughnut"
    FUNNEL = "funnel"
    LINE = "line"
    AREA = "area"

class ColorOption(str, Enum):
    DEFAULT = "default"
    PRIMARY = "primary"
    SECONDARY = "secondary"
    MUTED = "muted"
    SUCCESS = "success"
    DANGER = "danger"

class SizeOption(str, Enum):
    SM = "sm"
    MD = "md"
    LG = "lg"
    XL = "xl"
