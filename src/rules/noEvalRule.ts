/*
 * Copyright 2013 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

/// <reference path='../../lib/tslint.d.ts' />

export class Rule extends Lint.Rules.AbstractRule {
    public static FAILURE_STRING = "forbidden eval";

    public apply(syntaxTree: TypeScript.SyntaxTree): Lint.RuleFailure[] {
        return this.applyWithWalker(new NoEvalWalker(syntaxTree, this.getOptions()));
    }
}

class NoEvalWalker extends Lint.RuleWalker {
    public visitInvocationExpression(node: TypeScript.InvocationExpressionSyntax): void {
        var expression = node.expression;
        if (expression.isToken() && expression.kind() === TypeScript.SyntaxKind.IdentifierName) {
            var firstToken = expression.firstToken();
            if (firstToken.text() === "eval") {
                var position = this.position() + node.leadingTriviaWidth();
                this.addFailure(this.createFailure(position, firstToken.width(), Rule.FAILURE_STRING));
            }
        }

        super.visitInvocationExpression(node);
    }
}
