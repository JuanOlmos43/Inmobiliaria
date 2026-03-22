const origPrepare = Error.prepareStackTrace;
Error.prepareStackTrace = function (err, stack) {
  return (
    err.message + "\n" + stack.map((s) => "  at " + s.toString()).join("\n")
  );
};
