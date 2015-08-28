export function wrap (comments) {

  var output = '/*\n';

  comments.forEach(line => {

    output = output + '* '
            + line + '\n';

  });

  output = output + '*\n';

  return output;

};
