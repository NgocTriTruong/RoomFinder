package fit.nlu.tmdt.common.exceptions;

import fit.nlu.tmdt.common.utils.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Business Exception
 * Exception chung cho business logic
 */
@Getter
public class BusinessException extends RuntimeException {

    private final String errorCode;
    private final String message;
    private final HttpStatus httpStatus;

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode.getCode();
        this.message = errorCode.getMessage();
        this.httpStatus = errorCode.getHttpStatus();
    }

    public BusinessException(ErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode.getCode();
        this.message = message;
        this.httpStatus = errorCode.getHttpStatus();
    }

    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.message = message;
        this.httpStatus = HttpStatus.BAD_REQUEST;
    }

    public BusinessException(String message) {
        super(message);
        this.errorCode = "BUSINESS_ERROR";
        this.message = message;
        this.httpStatus = HttpStatus.BAD_REQUEST;
    }
}