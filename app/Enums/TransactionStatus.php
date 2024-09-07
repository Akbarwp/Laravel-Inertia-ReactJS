<?php

namespace App\Enums;

enum TransactionStatus: int
{
    case PENDING = 1;
    case PACKAGING = 2;
    case SHIPMENT = 3;
    case FINISHED = 4;
    case CANCEL = 5;
}
